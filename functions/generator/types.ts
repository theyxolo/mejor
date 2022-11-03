export enum BlendMode {
	normal = 'normal',
	multiply = 'multiply',
}

export type Trait = {
	name: string
	weight: string
	showInMetadata: boolean
	assetKey: string
}

export enum Rule {
	DoesNotMixWith = 'does-not-mix-with',
	OnlyMixesWith = 'only-mixes-with',
}

export type ProjectExport = {
	createdAt: number
	metadataIpfsHash: string
	artworkIpfsHash: string
	combinations: string[][]
}

export type Template = {
	name: string
	weight?: string
	count?: number
	showInMetadata: boolean
	attributes: string[]
}

export type CustomToken = {
	name: string
	traits: string[]
	assetKey: string
}

export type Attribute = {
	name: string
	alias?: string
	weight: string
	blendMode: BlendMode
	showInMetadata: boolean
	traits: string[]
}

export type Project = {
	owner: string
	name: string
	dimensions: number
	count: number
	metadata: {
		symbol: string
		name: string
		externalUrl: string
		description: string
		gateway: string
	}
	artwork: {
		dimensions: number
		format: string
	}
	rules: [
		/**
		 * Affected trait
		 */
		string,
		Rule,
		/**
		 * Linked trait
		 * */
		string,
	][]
	traits: {
		[traitId: string]: Trait
	}
	attributes: {
		[attributeId: string]: Attribute
	}
	customTokens: {
		[tokenId: string]: CustomToken
	}
	templates: {
		[templateId: string]: Template
	}
	export: ProjectExport
}

export type UserConfig = {
	projects: {
		[projectId: string]: Project
	}
}
