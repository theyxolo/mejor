import type { APIGatewayProxyEvent } from 'aws-lambda'
import { verifyMessage } from 'ethers/lib/utils'

import { HttpStatus } from './constants'
import { getObjectParams, getPresignedUrl, jsonResponse } from './utils'

const MAX_FILES = 150

const handler = async (
	event: APIGatewayProxyEvent
): Promise<Record<string, any>> => {
	const {
		paths: filesToUpload,
		signedMessage,
		project,
	} = event.body ? JSON.parse(event.body) : null

	const address = verifyMessage('I agree to the terms', signedMessage)

	if (
		!filesToUpload ||
		!Array.isArray(filesToUpload) ||
		!filesToUpload.length
	) {
		return jsonResponse(
			{ message: 'Invalid request body' },
			HttpStatus.badRequest
		)
	}

	if (filesToUpload.length > MAX_FILES) {
		return jsonResponse(
			{ message: 'Too many files to upload' },
			HttpStatus.badRequest
		)
	}

	const fileParams = filesToUpload.map((fileName) =>
		getObjectParams(address, project, fileName)
	)

	const presignedUrls = await Promise.all(fileParams.map(getPresignedUrl))

	return jsonResponse(
		presignedUrls.map((presignedUrl) => ({
			presignedUrl,
			key: presignedUrl.split('?')[0].split('/').pop(),
		})),
		HttpStatus.ok
	)
}

export default handler
