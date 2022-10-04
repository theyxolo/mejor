import type { APIGatewayProxyEvent } from 'aws-lambda'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { verifyMessage } from 'ethers/lib/utils'

import { ASSETS_BUCKET, getObject, jsonResponse, s3Client } from './utils'
import { HttpStatus } from './constants'

const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
	const { method } = event.requestContext['http']
	const { signature } = event.queryStringParameters ?? {}

	const address = verifyMessage('I agree to the terms', signature)
	const key = `${address}/config.json`

	if (!signature) {
		return jsonResponse(
			{ error: 'No signature provided' },
			HttpStatus.badRequest
		)
	}

	if (method === 'GET') {
		try {
			const response = await getObject(ASSETS_BUCKET, key, false)

			return jsonResponse(JSON.parse(response.toString('utf-8')), HttpStatus.ok)
		} catch (error) {
			// eslint-disable-next-line no-console
			console.log(error)
			// eslint-disable-next-line no-console
			console.log(signature)
			return jsonResponse(null, HttpStatus.notFound)
		}
	} else if (method === 'POST') {
		const config = event.body

		if (!config)
			return jsonResponse("Missing 'config' parameter", HttpStatus.badRequest)

		await s3Client.send(
			new PutObjectCommand({
				Bucket: ASSETS_BUCKET,
				Key: key,
				Body: config,
			})
		)

		return jsonResponse(config, HttpStatus.ok)
	}
}

export default handler
