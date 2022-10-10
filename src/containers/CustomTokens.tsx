import { useState } from 'react'
import { useField, useFormikContext } from 'formik'
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

import { CustomToken, Project } from 'lib/types'
import UploadDialog from 'modules/UploadDialog'

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
	const { getFieldProps } = useFormikContext()

	const [{ value: traits }] = useField<Project['traits']>(
		`projects.${projectId}.traits`,
	)
	const [{ value: name }] = useField(
		`projects.${projectId}.customTokens.${id}.name`,
	)
	const [{ value: tokenTraits }, , { setValue: setTokenTraits }] = useField<
		CustomToken['traits']
	>(`projects.${projectId}.customTokens.${id}.traits`)

	return (
		<>
			<Grid gap="var(--space--large)" gridTemplateColumns="3fr 1fr" key={id}>
				<div>
					<TextInput
						label={t('name')}
						{...getFieldProps(`projects.${projectId}.customTokens.${id}.name`)}
					/>
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
				</div>
				<Flex flexDirection="column" gap="var(--space--medium)">
					<TokenPreview
						assets={tokenTraits.map((key) => {
							const { assetKey } = traits[key] ?? {}
							return assetKey
						})}
						name={name}
						address={address!}
						projectId={projectId!}
					/>
					<Flex>
						<button onClick={() => onRemove(id)}>
							<MinusCircle />
						</button>
					</Flex>
				</Flex>
			</Grid>
		</>
	)
}

function CustomTokens() {
	const { t } = useTranslation()
	const { projectId } = useParams()
	const { address } = useAccount()

	const [isUploading, setIsUploading] = useState(false)

	const [{ value: customTokens }, , { setValue: setCustomTokens }] =
		useField<any>(`projects.${projectId}.customTokens`)
	const [{ value: traits }, , { setValue: setTraits }] = useField<
		CustomToken['traits']
	>(`projects.${projectId}.traits`)

	const customTokensArray = Object.entries(customTokens)

	function handleAddToken() {
		setIsUploading(true)
	}

	function handleRemoveToken(key: string) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { [key]: toDelete, ...newCustomTokens } = customTokens
		setCustomTokens(newCustomTokens)
	}

	async function handleUpload(
		assets: {
			name: string
			id: string
			assetKey: string
		}[],
	) {
		const asset = assets?.[0]
		if (!asset) return

		// Create trait
		await setTraits({
			...traits,
			[asset.id]: {
				// eslint-disable-next-line no-magic-numbers
				name: `New trait ${nanoid(6)}`,
				weight: '',
				showInMetadata: false,
				assetKey: asset.assetKey,
			},
		})

		await setCustomTokens({
			...customTokens,
			[nanoid()]: {
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
				<Grid gap="var(--space--large)" maxWidth="800px">
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
