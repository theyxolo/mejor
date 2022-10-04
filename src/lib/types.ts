import { BlendMode } from 'lib/constants'

export type Trait = {
	name: string
	weight: string
	showInMetadata: boolean
	assetKey: string
}

export type Template = {
	name: string
	weight: string
	showInMetadata: boolean
	attributes: string[]
}

export type CustomToken = {
	name: string
	traits: string[]
}

export type Attribute = {
	name: string
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
	rules: any[]
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
}

export type UserConfig = {
	projects: {
		[projectId: string]: Project
	}
	out: {
		[projectId: string]: string[][]
	}
}
