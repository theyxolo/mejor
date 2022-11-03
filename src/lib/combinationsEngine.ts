import { Project, Rule, Template } from 'lib/types'

// https://stackoverflow.com/a/55671924/5239847
function getWeightedRandom(items: any[], existingWeights?: number[]) {
	const weights =
		existingWeights ??
		items.map((item) => Number(String(item.weight ?? '1').replace('%', '')))

	let i
	for (i = 0; i < weights.length; i++) {
		weights[i] += weights[i - 1] || 0
	}

	const random = Math.random() * weights[weights.length - 1]

	for (i = 0; i < weights.length; i++) {
		if (weights[i] > random) break
	}

	return items[i]
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffleArray(array: any[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		const temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}
	return array
}

export function getOut(config: Omit<Project, 'export'>) {
	const { rules, templates, attributes, traits, count, customTokens } = config

	const combinations: string[] = []

	// Push custom tokens first
	Object.values(customTokens).forEach((customToken) => {
		combinations.push(customToken.traits.join(','))
	})

	while (combinations.length < count) {
		const template: Template = getWeightedRandom(Object.values(templates))
		const templateAttributes = template?.attributes.map(
			(attributeId) => attributes[attributeId],
		)
		const assetGroups = templateAttributes.map(({ traits: traitIds }) =>
			traitIds.map((traitId) => traitId),
		)

		let currentComb = ''

		assetGroups.forEach((groupTraits) => {
			let filteredTraits = groupTraits
			// Filter asset group by rules
			const [baseTrait, rule] =
				rules.find(([baseTrait, , affectedTrait]) => {
					return (
						currentComb.includes(affectedTrait) &&
						groupTraits.includes(baseTrait)
					)
				}) ?? []

			if (rule) {
				if (rule === Rule.DoesNotMixWith) {
					filteredTraits = filteredTraits.filter(
						(traitId) => traitId !== baseTrait,
					)
				} else if (rule === Rule.OnlyMixesWith) {
					filteredTraits = filteredTraits.filter(
						(traitId) => traitId === baseTrait,
					)
				}
			}

			const weights = filteredTraits.map((traitId) =>
				Number(String(traits[traitId].weight).replace('%', '')),
			)
			const nextAsset = getWeightedRandom(filteredTraits, weights)

			currentComb = `${currentComb}${currentComb ? `,` : ''}${nextAsset}`
		})

		// If there's not an existing one already, push to the output
		if (!combinations.find((traitGroup) => traitGroup === currentComb)) {
			combinations.push(currentComb)
		}
	}

	const outAssetKeys = shuffleArray(combinations).map((o) =>
		o.split(',').map((traitId: string) => traits[traitId].assetKey),
	)

	return outAssetKeys
}
