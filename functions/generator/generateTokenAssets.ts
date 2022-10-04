import { parentPort, workerData } from 'node:worker_threads'

import sharp, { FormatEnum } from 'sharp'
import { fromBuffer } from 'file-type'

async function generateTokenAssets({
	imageBuffers,
	project,
}: {
	imageBuffers: Buffer[]
	project: {
		traits: { [key: string]: { name: string } }
		attributes: { [key: string]: { name: string; traits: string[] } }
		metadata: { [key: string]: string }
		artwork: { format: keyof FormatEnum; dimensions: number }
	}
}): Promise<Buffer> {
	const [baseImage, ...layerImages] = imageBuffers
	const desiredExtension = project.artwork?.format

	const mime = await fromBuffer(baseImage)

	const image = sharp(baseImage).composite(
		layerImages.map((imageBuffer) => ({ input: imageBuffer }))
	)

	if (desiredExtension && mime.ext !== desiredExtension)
		image.toFormat(desiredExtension)
	// .resize({
	// 	width: project.artwork?.dimensions ?? 1200,
	// 	height: project.artwork?.dimensions ?? 1200,
	// 	fit: sharp.fit.cover,
	// 	position: sharp.strategy.entropy,
	// })

	return image.toBuffer()
}

async function main() {
	if (!workerData) return

	const image = await generateTokenAssets(workerData)

	parentPort.postMessage(image)

	parentPort.emit('exit')
}

main()

export { generateTokenAssets }
