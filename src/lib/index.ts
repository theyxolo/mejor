import type { Project } from 'lib/types'
import { ASSETS_BUCKET } from 'lib/constants'

async function sha256(message: any) {
	// encode as UTF-8
	const msgBuffer = new TextEncoder().encode(message)

	// hash the message
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)

	// convert ArrayBuffer to Array
	const hashArray = Array.from(new Uint8Array(hashBuffer))

	// convert bytes to hex string
	// eslint-disable-next-line no-magic-numbers
	const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
	return hashHex
}

/**
 * Function to truncate given string in the middle by a max length
 */
export function truncateMiddle(str: string, maxLength: number) {
	if (str.length <= maxLength) {
		return str
	}

	const separator = '...'
	const sepLen = separator.length
	const charsToShow = maxLength - sepLen
	// eslint-disable-next-line no-magic-numbers
	const frontChars = Math.ceil(charsToShow / 2)
	// eslint-disable-next-line no-magic-numbers
	const backChars = Math.floor(charsToShow / 2)

	return (
		str.substring(0, frontChars) +
		separator +
		str.substring(str.length - backChars)
	)
}

export function swapElement(array: any, indexA: any, indexB: any) {
	const newArray = [...array]
	const tmp = newArray[indexA]
	newArray[indexA] = newArray[indexB]
	newArray[indexB] = tmp

	return newArray
}

export function getAssetUrl(
	key: string,
	options?: { address: string; project: string },
) {
	if (!options) return `https://${ASSETS_BUCKET}.s3.amazonaws.com/${key}`

	const { address, project } = options
	return `https://${ASSETS_BUCKET}.s3.amazonaws.com/${address}/${project}/${key}`
}

export function getTokenConfig(
	attributeTraits: { assetKey: string; weight: string | number }[][],
): string[] {
	const randNum = [] as string[]

	attributeTraits.forEach((trait) => {
		const totalWeight = trait.reduce(
			(acc, trait) =>
				acc +
				(typeof trait.weight === 'string'
					? parseInt((trait.weight ?? '100%').replace('%', ''), 10)
					: trait.weight),
			0,
		)

		// Number between 0 and totalWeight
		let random = Math.floor(Math.random() * totalWeight)

		for (let index = 0; index < trait.length; index++) {
			const currentElement = {
				assetKey: trait[index].assetKey,
				weight: (typeof trait[index].weight === 'string'
					? parseInt(
							((trait[index].weight || '100%') as string).replace('%', ''),
							10,
					  )
					: trait[index].weight) as number,
			}

			// Subtract the current weight from the random weight until we reach a sub zero value.
			random = random - currentElement.weight

			if (random < 0) {
				return randNum.push(currentElement.assetKey)
			}
		}
	})

	return randNum
}

export function getOut(config: Project) {
	const [template]: any = Object.values(config?.templates ?? {})
	const attributes = template?.attributes.map(
		(attributeId: string) => config.attributes[attributeId],
	)

	const assets = attributes.map(({ traits: traitIds }: any) =>
		traitIds.map((traitId: string) => config.traits[traitId]),
	)

	const combinations: string[][] = []

	while (combinations.length < config.count) {
		combinations.push(getTokenConfig(assets))
	}

	return combinations
}

export function getAssetId(layers: any) {
	return sha256(JSON.stringify(layers))
}

export function injectVariables(text: any, variables: any) {
	return text
		.replace(/{([^}]+)}/g, (_: any, variable: any) => variables[variable])
		.replaceAll('\\n', '\n')
}
