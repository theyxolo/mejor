import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MinusCircle, PlusCircle } from 'react-feather'
import { useParams } from 'react-router'
import { nanoid } from 'nanoid'
import { useAccount } from 'wagmi'

import TokenPreview from 'modules/TokenPreview'
import Empty from 'modules/Empty'

import { Flex, Grid } from 'components/system'
import Button, { Icon } from 'components/Button'
import TextInput from 'components/TextInput'

import UploadDialog from 'modules/UploadDialog'
import { useField, useFieldProps, useFieldValue } from 'lib/recoil'
import { CustomToken, Project } from 'lib/types'
import { MICRO_ID } from 'lib/constants'

function CustomTokenItem({
	projectId,
	id,
	address,
	onRemove,
}: {
	projectId: string
	id: string
	address: string
	onRemove: (key: string) => void
}) {
	const { t } = useTranslation()

	const traits = useFieldValue<Project['traits']>('traits')
	const [tokenTraits, setTokenTraits] = useField<CustomToken['traits']>(
		`customTokens.${id}.traits`,
	)
	const nameFieldProps = useFieldProps<string>(`customTokens.${id}.name`)

	return (
		<Flex gap="var(--space--large)" flexDirection="column" key={id}>
			<Flex style={{ flex: 1 }} gap="var(--space--medium)">
				<TextInput style={{ flex: 1 }} label={t('name')} {...nameFieldProps} />
				<button onClick={() => onRemove(id)}>
					<MinusCircle />
				</button>
			</Flex>
			<Flex flexDirection="column" gap="var(--space--medium)">
				<TokenPreview
					assets={tokenTraits.map((key: any) => {
						const { assetKey } = traits[key] ?? {}
						return assetKey
					})}
					address={address!}
					projectId={projectId!}
				/>
			</Flex>
			<p style={{ marginTop: 'var(--space--medium)' }}>
				<b>{t('traits')}</b>
			</p>
			{/* <Grid
							gridTemplateColumns="1fr 1fr auto"
							gap="var(--space--medium)"
							key={index}
						>
							<TextInput
								placeholder={t('placeholders.traitName')}
								{...getFieldProps(
									`projects.${projectId}.customTokens.${id}.trait.${index}.type`,
								)}
							/>
							<TextInput
								placeholder={t('placeholders.traitValue')}
								{...getFieldProps(
									`projects.${projectId}.traits.${index}.value`,
								)}
							/>
							<button
								style={{ backgroundColor: 'transparent', color: 'white' }}
								onClick={() =>
									setTokenTraits(tokenTraits.filter((_, i) => i !== index))
								}
							>
								<MinusCircle strokeWidth={3} />
							</button>
						</Grid> */}
			<Button
				style={{ marginTop: 'var(--space--medium)' }}
				onClick={() => setTokenTraits([...tokenTraits, ''])}
			>
				{t('addTrait')}
				<Icon as={PlusCircle} />
			</Button>
		</Flex>
	)
}

function CustomTokens() {
	const { t } = useTranslation()
	const { projectId } = useParams()
	const { address } = useAccount()

	const [isUploading, setIsUploading] = useState(false)

	const [customTokens, setCustomTokens] =
		useField<Project['customTokens']>('customTokens')
	const [traits, setTraits] = useField<Project['traits']>('traits')

	const customTokensArray = Object.entries(customTokens)

	function handleAddToken() {
		setIsUploading(true)
	}

	function handleRemoveToken(key: string) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { [key]: toDelete, ...newCustomTokens } = customTokens
		setCustomTokens(newCustomTokens)
	}

	function handleUpload(
		assets: {
			name: string
			id: string
			assetKey: string
		}[],
	) {
		const asset = assets?.[0]
		if (!asset) return

		// Create trait
		setTraits({
			...traits,
			[asset.id]: {
				// eslint-disable-next-line no-magic-numbers
				name: `New trait ${nanoid(6)}`,
				weight: '',
				showInMetadata: false,
				assetKey: asset.assetKey,
			},
		})

		setCustomTokens({
			...customTokens,
			[nanoid(MICRO_ID)]: {
				name: asset.name ?? 'New token',
				assetKey: '',
				traits: [asset.id],
			},
		})

		setIsUploading(false)
	}

	return (
		<>
			{isUploading && (
				<UploadDialog
					isMultiple={false}
					onClose={() => setIsUploading(false)}
					onUpload={handleUpload}
				/>
			)}

			<Flex justifyContent="space-between" alignItems="center">
				<h2>{t('customTokens')}</h2>
				<Button onClick={handleAddToken}>
					{t('addToken')}
					<Icon as={PlusCircle} />
				</Button>
			</Flex>

			{customTokensArray.length ? (
				<Grid
					gridTemplateColumns="repeat(auto-fit, minmax(150px, 1fr))"
					gap="var(--space--large)"
				>
					{customTokensArray.map(([id]) => (
						<CustomTokenItem
							id={id}
							key={id}
							address={address!}
							projectId={projectId!}
							onRemove={handleRemoveToken}
						/>
					))}
				</Grid>
			) : (
				<Empty />
			)}
		</>
	)
}

export default CustomTokens
