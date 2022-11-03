import { useTranslation } from 'react-i18next'

import { Flex } from 'components/system'
import { useFieldProps } from 'lib/recoil'

function Token() {
	const { t } = useTranslation()

	const countProps = useFieldProps('count')
	const nameProps = useFieldProps('name')
	const symbolProps = useFieldProps('metadata.symbol')
	const artworkDimensionsProps = useFieldProps('artwork.dimensions')
	const artworkFormatProps = useFieldProps('artwork.format')
	const externalUrlProps = useFieldProps('metadata.externalUrl')
	const descriptionProps = useFieldProps('metadata.description')
	const metadataNameProps = useFieldProps('metadata.name')

	return (
		<>
			<h2>{t('general')}</h2>
			<p style={{ marginBottom: 'var(--space--large)' }}>
				{t('screens.collection.description')}
			</p>
			<Flex gap="var(--space--medium)" flexDirection="column" maxWidth="600px">
				<label htmlFor="">
					<b>{t('collectionCount')}</b>
					<input
						type="number"
						placeholder={t('placeholders.collectionCount')}
						{...countProps}
					/>
				</label>
				<label htmlFor="">
					<b>{t('collectionName')}</b>
					<input
						type="name"
						placeholder={t('placeholders.collectionName')}
						{...nameProps}
					/>
				</label>
				<label htmlFor="">
					<b>{t('symbol')}</b>
					<input
						type="text"
						placeholder={t('placeholders.collectionSymbol')}
						{...symbolProps}
					/>
				</label>
			</Flex>

			<hr />

			<h2>{t('artwork')}</h2>
			<Flex gap="var(--space--medium)" flexDirection="column" maxWidth="600px">
				<label htmlFor="">
					<b>{t('dimensions')}</b>
					<input type="number" {...artworkDimensionsProps} />
				</label>
				<label htmlFor="">
					<b>{t('format')}</b>
					<select {...artworkFormatProps}>
						<option value="">{t('useInput')}</option>
						<option value="png">PNG</option>
						<option value="jpeg">JPEG</option>
						<option value="webp">WebP</option>
					</select>
				</label>
			</Flex>

			<hr />

			<h2>{t('metadata')}</h2>
			<h3>{t('token')}</h3>
			<Flex gap="var(--space--medium)" flexDirection="column" maxWidth="600px">
				<label htmlFor="">
					<b>{t('externalUrl')}</b>
					<input type="text" {...externalUrlProps} />
				</label>
				<label htmlFor="">
					<b>{t('description')}</b>
					<textarea {...descriptionProps} />
				</label>
				<label htmlFor="">
					<b>{t('name')}</b>
					<input type="text" {...metadataNameProps} />
				</label>
			</Flex>
		</>
	)
}

export default Token
