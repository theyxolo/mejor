import { Worker } from 'node:worker_threads'
import { PassThrough } from 'node:stream'

import JSZip from 'jszip'
import { File, NFTStorage } from 'nft.storage'
import PQueue from 'p-queue'
import { Upload } from '@aws-sdk/lib-storage'
import type { CarReader } from '@ipld/car/api'
import Pusher from 'pusher'
import { FormatEnum } from 'sharp'

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: 'us2',
	useTLS: true,
})

import { getObject, getMaxCPUs, s3Client, ASSETS_BUCKET } from './utils'
import './generateTokenAssets'

type UserConfig = {
	projects: {
		[projectId: string]: {
			name: string
			traits: { [key: string]: { name: string } }
			attributes: { [key: string]: { name: string; traits: string[] } }
			metadata: { [key: string]: string }
			artwork: { format: keyof FormatEnum; dimensions: number }
		}
	}
	out: { [projectId: string]: string[][] }
}

const handler = async (
	event: {
		project: string
		address: string
		nftStorageToken?: string
		hash: string
	},
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	context: any
): Promise<any> => {
	const { hash, address, project: projectId, nftStorageToken } = event

	const nftstorage = nftStorageToken
		? new NFTStorage({ token: nftStorageToken })
		: undefined

	const stringData = await getObject(
		ASSETS_BUCKET,
		`${address}/config.json`,
		false
	)

	const data = JSON.parse(stringData.toString()) as UserConfig

	const project = data.projects[projectId]
	const combinations = data.out[projectId]

	const projectConfig = project
	const artworkFormat = project.artwork?.format ?? 'png'

	const zipPath = `${address}/${projectId}/${hash}.zip`

	const uniqueAssets = [...new Set(combinations.flat())]

	// Network intensive
	// We would want to prefetch all images, so we can cache them
	await Promise.all(
		uniqueAssets.map((image) =>
			getObject(ASSETS_BUCKET, `${address}/${projectId}/${image}`)
		)
	)

	const maxConcurrent = getMaxCPUs()

	const queue = new PQueue({ concurrency: maxConcurrent })
	const zip = new JSZip()

	const assets = new Map<number, { image: Buffer; metadata?: string }>()
	combinations.forEach((traits: string[], index: number) => {
		queue.add(async () => {
			// This will get the images from the cache
			const imageBuffers = await Promise.all(
				traits.map((image: string) =>
					getObject(ASSETS_BUCKET, `${address}/${projectId}/${image}`)
				)
			)

			// TODO: use shared memory
			await new Promise((resolve) => {
				const worker = new Worker('./generateTokenAssets', {
					workerData: { imageBuffers, project: projectConfig },
				})

				worker.on('message', (image) => {
					assets.set(index, { image })
				})

				worker.on('exit', (exitCode) => {
					resolve(exitCode)
				})
			})
		})
	})

	let lastProgress = 0
	queue.on('next', () => {
		const remaining = queue.size + queue.pending
		const progress = Math.floor(
			// Only send values from 0 to 10
			// eslint-disable-next-line no-magic-numbers
			((combinations.length - remaining) / combinations.length) * 10
		)

		if (progress <= lastProgress) return

		lastProgress = progress

		pusher.trigger(hash, 'generate--image', {
			progress,
			remaining: queue.size,
		})
	})

	await context.span(`generate ${combinations.length} images`, async () => {
		await queue.onIdle()
	})

	//
	// Create CAR for images
	//
	const images = []
	assets.forEach(({ image }, key) =>
		images.push(
			new File([image], `${key}.${artworkFormat}`, {
				type: `image/${artworkFormat}`,
			})
		)
	)

	let imagesCID: unknown
	let imagesCAR: CarReader
	await context.span('encode images car', async () => {
		if (nftstorage) {
			const { cid, car } = await NFTStorage.encodeDirectory(images)
			imagesCID = cid
			imagesCAR = car
		}
	})

	assets.forEach(({ image }, key) => {
		// Generate metadata
		const metadata = {
			name: project.metadata?.name
				?.replace('{{number}}', String(key))
				.replace?.('{{project}}', project.name),
			description: project.metadata?.description?.replace(
				'{{number}}',
				String(key)
			),
			external_url: project.metadata?.externalUrl?.replace(
				'{{number}}',
				String(key)
			),
			image: imagesCID ? `ipfs://${imagesCID}/${key}.${artworkFormat}` : '',
			attributes: combinations[key].map((assetUrl) => {
				const assetKey = assetUrl.replace(/\.[^/.]+$/, '')

				return {
					trait_type:
						Object.values(project.attributes).find((attribute) =>
							attribute.traits.includes(assetKey)
						)?.name ?? 'No attribute name',
					value: project.traits[assetKey]?.name ?? 'No trait name',
				}
			}),
		}

		// eslint-disable-next-line no-magic-numbers
		assets.set(key, { image, metadata: JSON.stringify(metadata, null, 2) })
	})

	const metadata = []
	assets.forEach(({ metadata: metaString }, key) =>
		metadata.push(
			new File(metaString, `${key}.json`, { type: 'application/json' })
		)
	)

	let metadataCID: unknown
	let metadataCAR: CarReader
	await context.span('encode metadata car', async () => {
		if (nftstorage) {
			const { cid, car } = await NFTStorage.encodeDirectory(metadata)
			metadataCID = cid
			metadataCAR = car
		}
	})

	await context.span('upload to ipfs', async () => {
		// Upload CARs to nft.storage
		await Promise.all([
			nftstorage?.storeCar(imagesCAR),
			nftstorage?.storeCar(metadataCAR),
		])
	})

	pusher.trigger(hash, 'generate--cid', { metadataCID, metadataCAR })

	// Create ZIP
	assets.forEach((value, key) => {
		zip.file(`${projectId}/assets/${key}.${artworkFormat}`, value.image)
		zip.file(`${projectId}/metadata/${key}.json`, value.metadata)
	})

	const passThrough = new PassThrough()

	zip
		.generateNodeStream({
			type: 'nodebuffer',
			compression: 'DEFLATE',
			compressionOptions: { level: 9 },
		})
		.pipe(passThrough)

	const multipartUpload = new Upload({
		client: s3Client,
		queueSize: maxConcurrent,
		leavePartsOnError: false,
		params: {
			Key: zipPath,
			Body: passThrough,
			Bucket: ASSETS_BUCKET,
			ContentType: 'application/zip',
		},
	})

	await multipartUpload.done()
}

export default handler
