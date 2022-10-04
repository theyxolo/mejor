import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { verifyMessage } from 'ethers/lib/utils'
import AWS from 'aws-sdk'

import { jsonResponse } from './utils'
import { HttpStatus } from './constants'

const lambda = new AWS.Lambda({ region: 'us-east-1' })

const handler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const { project, signedMessage, nftStorageToken, hash } = JSON.parse(
		event.body ?? '{}'
	)
	const address = verifyMessage('I agree to the terms', signedMessage)

	if (!address)
		return jsonResponse({ error: 'Invalid signature' }, HttpStatus.badRequest)
	if (!project || typeof project !== 'string')
		return jsonResponse(
			{ message: 'Invalid request body' },
			HttpStatus.badRequest
		)

	await lambda
		.invoke({
			FunctionName: process.env.engineFunctionName,
			Payload: JSON.stringify({ project, address, nftStorageToken, hash }),
			InvocationType: 'Event',
		})
		.promise()

	// Use output hash to name zip
	const key = `${address}/${project}/${hash}.zip`

	return { body: key, statusCode: HttpStatus.ok }
}

export default handler
