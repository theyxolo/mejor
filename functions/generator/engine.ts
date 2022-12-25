import { Worker } from 'node:worker_threads'
import { PassThrough } from 'node:stream'

import JSZip from 'jszip'
import { File, NFTStorage } from 'nft.storage'
import PQueue from 'p-queue'
import { Upload } from '@aws-sdk/lib-storage'
import type { CarReader } from '@ipld/car/api'
import Pusher from 'pusher'
import type { CID } from 'nft.storage/dist/src/lib/interface'

const pusher = new Pusher({
	appId: process.env.PUSHER_APP_ID,
	key: process.env.PUSHER_KEY,
	secret: process.env.PUSHER_SECRET,
	cluster: 'us2',
	useTLS: true,
})

import { getObject, getMaxCPUs, s3Client, ASSETS_BUCKET } from './utils'
import './generateTokenAssets'
import { UserConfig } from './types'

const handler = async (
	event: {
		project: string
		address: string
		nftStorageToken?: string
		hash: string
	},
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	context: any,
): Promise<any> => {
	const { hash, address, project: projectId, nftStorageToken } = event

	const nftstorage = nftStorageToken
		? new NFTStorage({ token: nftStorageToken })
		: undefined

	const stringData = await getObject(
		ASSETS_BUCKET,
		`${address}/config.json`,
		false,
	)

	const data = JSON.parse(stringData.toString()) as UserConfig

	const project = data.projects[projectId]
	const { combinations } = project.export

	const projectConfig = project
	const artworkFormat = project.artwork?.format ?? 'png'

	const zipPath = `${address}/${projectId}/${hash}.zip`

	const uniqueAssets = [...new Set(combinations.flat())]

	// Network intensive
	// We would want to prefetch all images, so we can cache them
	await Promise.all(
		uniqueAssets.map((image) =>
			getObject(ASSETS_BUCKET, `${address}/${projectId}/${image}`),
		),
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
					getObject(ASSETS_BUCKET, `${address}/${projectId}/${image}`),
				),
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
			((combinations.length - remaining) / combinations.length) * 10,
		)

		if (progress <= lastProgress) return

		lastProgress = progress

		pusher.trigger(hash, 'generated--image', {
			// eslint-disable-next-line no-magic-numbers
			progress: progress * 10,
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
	assets.forEach(({ image }, index) =>
		images.push(
			new File([image], `${index + 1}.${artworkFormat}`, {
				type: `image/${artworkFormat}`,
			}),
		),
	)

	let imagesCID: CID
	let imagesCAR: CarReader
	await context.span('encode images car', async () => {
		if (nftstorage) {
			const { cid, car } = await NFTStorage.encodeDirectory(images)
			imagesCID = cid
			imagesCAR = car
		}
	})

	assets.forEach(({ image }, index) => {
		// Generate metadata
		const metadata = {
			name: project.metadata?.name
				?.replace('{{number}}', String(index + 1))
				.replace?.('{{project}}', project.name),
			description: project.metadata?.description?.replace(
				'{{number}}',
				String(index + 1),
			),
			external_url: project.metadata?.externalUrl?.replace(
				'{{number}}',
				String(index + 1),
			),
			dna: combinations[index].map((trait) => trait.split('.')[0]).join(':'),
			edition: index + 1,
			compiler: 'Mejor by Tonim',
			image: imagesCID
				? `ipfs://${imagesCID}/${index + 1}.${artworkFormat}`
				: '',
			attributes: combinations[index]
				.filter((assetUrl) => {
					const assetKey = assetUrl.replace(/\.[^/.]+$/, '')
					const trait = project.traits[assetKey]
					const attribute = Object.values(project.attributes).find(
						(attribute) => attribute.traits.includes(assetKey),
					)

					return trait.showInMetadata && attribute.showInMetadata
				})
				.map((assetUrl) => {
					const assetKey = assetUrl.replace(/\.[^/.]+$/, '')

					const trait = Object.values(project.attributes).find((attribute) =>
						attribute.traits.includes(assetKey),
					)
					const traitTypeName = trait?.alias ?? trait?.name
					const traitValue = project.traits[assetKey]?.name

					//
					if (!traitTypeName) return { value: traitValue }

					return {
						trait_type: traitTypeName,
						value: traitValue ?? true,
					}
				}),
		}

		// eslint-disable-next-line no-magic-numbers
		assets.set(index, { image, metadata: JSON.stringify(metadata, null, 2) })
	})

	const metadata = []
	assets.forEach(({ metadata: metaString }, index) =>
		metadata.push(
			new File(metaString, `${index + 1}.json`, { type: 'application/json' }),
		),
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

	if (nftstorage) {
		pusher.trigger(hash, 'uploaded--car', {
			assets: imagesCID.toString(),
			metadata: metadataCID.toString(),
		})
	}

	// Create ZIP
	assets.forEach((value, index) => {
		zip.file(`${projectId}/assets/${index + 1}.${artworkFormat}`, value.image)
		zip.file(`${projectId}/metadata/${index + 1}.json`, value.metadata)
	})

	const passThrough = new PassThrough()

	zip
		.generateNodeStream({
			type: 'nodebuffer',
			compression: 'DEFLATE',
			compressionOptions: { level: 9 },
		})
		.pipe(passThrough)

	pusher.trigger(hash, 'started--zip', {
		imagesCID,
		metadataCID,
	})

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

	pusher.trigger(hash, 'uploaded--zip', {
		imagesCID,
		metadataCID,
	})
}

export default handler
