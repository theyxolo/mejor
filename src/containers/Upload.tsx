import { useFormikContext } from 'formik'
import { useNavigate } from 'react-router-dom'
import { nanoid } from 'nanoid'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'

import UploadZone from 'modules/UploadZone'

import directory from 'assets/directory.png'
import { Main } from 'GlobalStyled'
import { BlendMode } from 'lib/constants'

function groupBy(xs: any[], key: string) {
	return xs.reduce(function (rv, x) {
		;(rv[x[key]] = rv[x[key]] || []).push(x)
		return rv
	}, {})
}

function Upload() {
	const navigate = useNavigate()
	const projectId = nanoid()
	const { t } = useTranslation()
	const { address } = useAccount()

	const { setFieldValue, values } = useFormikContext()

	async function handleUpload(files: any) {
		const traitsByAttribute = Object.entries(groupBy(files, 'attribute'))

		const attributesList = traitsByAttribute.map(
			([attributeName, traits]: [string, any]) => [
				nanoid(),
				{
					name: attributeName,
					blendMode: BlendMode.normal,
					showInMetadata: true,
					weight: '100%',
					traits: traits.map(({ id }: any) => id),
				},
			],
		)

		const traitsList = files.map((trait: any) => [
			trait.id,
			{
				name: trait.name,
				weight: '100%',
				showInMetadata: true,
				assetKey: trait.assetKey,
			},
		])

		await setFieldValue(
			'projects',
			{
				...((values as any)?.projects ?? {}),
				[projectId]: {
					name: projectId,
					owner: address,
					count: 1000,
					metadata: {
						// eslint-disable-next-line no-magic-numbers
						symbol: projectId.slice(0, 3).toUpperCase(),
						name: `{{project}} #{{number}}`,
					},
					artwork: {
						dimensions: 1200,
						format: 'png',
					},
					rules: [],
					traits: Object.fromEntries(traitsList),
					attributes: Object.fromEntries(attributesList),
					customTokens: [],
					templates: {
						[nanoid()]: {
							name: 'default',
							weight: '100%',
							showInMetadata: true,
							attributes: attributesList.map(([id]) => id),
						},
					},
				},
			},
			true,
		)

		navigate(`/${projectId}`)
	}

	return (
		<Main>
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 10,
					padding: 10,
					minHeight: '100%',
				}}
			>
				<h2>{t('screens.upload.title')}</h2>
				<p style={{ textAlign: 'center' }}>
					Preferably being a base folder with each asset inside a layer folder.
					Know that the assets must have in the <b>same dimensions</b>.
				</p>
				<UploadZone onUpload={handleUpload} projectId={projectId} />
				<img
					style={{ width: 200, height: 200, borderRadius: 10 }}
					src={directory}
					alt=""
				/>
			</div>
		</Main>
	)
}

export default Upload
