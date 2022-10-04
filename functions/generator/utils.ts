import os from 'node:os'
import { execSync } from 'node:child_process'
import { Readable } from 'node:stream'

import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
	type PutObjectCommandInput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

import { HttpStatus } from './constants'

const fileCache = new Map<string, Buffer>()

const exec = (command: string) => execSync(command, { encoding: 'utf8' })

export const ASSETS_BUCKET = process.env?.ASSETS_BUCKET

export const s3Client = new S3Client({ region: process.env.AWS_REGION })

export function getMaxCPUs(): number {
	let numberOfCPUs = 1
	try {
		const platform = os.platform()
		if (platform === 'linux') {
			const output = exec('grep -c ^processor /proc/cpuinfo')
			numberOfCPUs = parseInt(output.trim(), 10)
		} else if (platform === 'darwin') {
			const output = exec('sysctl -n hw.physicalcpu_max')
			numberOfCPUs = parseInt(output.trim(), 10)
		} else if (platform === 'win32') {
			const output = exec('WMIC CPU Get NumberOfCores')
			numberOfCPUs = output
				.split(os.EOL)
				.map(parseInt)
				.filter((value) => !isNaN(value))
				.reduce((sum, number) => sum + number, 0)
		} else {
			const cores = os.cpus().filter((cpu, index) => {
				const hasHyperThreading = cpu.model.includes('Intel')
				// eslint-disable-next-line no-magic-numbers
				const isOdd = index % 2 === 1
				return !hasHyperThreading || isOdd
			})
			numberOfCPUs = cores.length
		}

		return numberOfCPUs
	} catch {
		return numberOfCPUs
	}
}

export function getObjectParams(
	address: string,
	project: string,
	fileName: string
): PutObjectCommandInput {
	return {
		Bucket: ASSETS_BUCKET,
		Key: `${address}/${project}/${fileName}`,
		ContentType: `image/${fileName.split('.').pop()}`,
	}
}

export function streamToBuffer(stream: Readable): Promise<Buffer> {
	return new Promise<Buffer>((resolve, reject) => {
		const chunks: Buffer[] = []
		stream.on('data', (chunk) => chunks.push(chunk))
		stream.once('end', () => resolve(Buffer.concat(chunks)))
		stream.once('error', reject)
	})
}

export async function getObject(
	bucket: string,
	key: string,
	shouldUseCache = true
): Promise<Buffer> {
	const cacheKey = `${bucket}:${key}`

	if (shouldUseCache) {
		if (fileCache.has(cacheKey)) {
			return fileCache.get(cacheKey)
		} else {
			// eslint-disable-next-line no-console
			console.log('Cache miss', cacheKey)
		}
	}

	const { Body } = await s3Client.send(
		new GetObjectCommand({ Bucket: bucket, Key: key })
	)

	const bufferBody = await streamToBuffer(Body as Readable)
	if (shouldUseCache) {
		fileCache.set(cacheKey, bufferBody)
		return bufferBody
	}

	return bufferBody
}

export function getPresignedUrl(
	params: PutObjectCommandInput
): Promise<string> {
	return getSignedUrl(s3Client, new PutObjectCommand(params), {
		expiresIn: 3600,
	})
}

export function jsonResponse(
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	body: any,
	statusCode = HttpStatus.ok
): {
	body: string
	statusCode: number
	headers: Record<string, string | boolean>
} {
	return {
		statusCode,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Credentials': true,
		},
		body: JSON.stringify(body),
	}
}
