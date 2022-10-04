import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useFormikContext } from 'formik'

import { Flex } from 'components/system'

function Token() {
	const { projectId } = useParams()
	const { t } = useTranslation()

	const { getFieldProps } = useFormikContext()

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
						{...getFieldProps(`projects.${projectId}.count`)}
					/>
				</label>
				<label htmlFor="">
					<b>{t('collectionName')}</b>
					<input
						type="name"
						placeholder={t('placeholders.collectionName')}
						{...getFieldProps(`projects.${projectId}.name`)}
					/>
				</label>
				<label htmlFor="">
					<b>{t('symbol')}</b>
					<input
						type="text"
						placeholder={t('placeholders.collectionSymbol')}
						{...getFieldProps(`projects.${projectId}.symbol`)}
					/>
				</label>
			</Flex>

			<hr />

			<h2>{t('metadata')}</h2>
			<h3>{t('token')}</h3>
			<Flex gap="var(--space--medium)" flexDirection="column" maxWidth="600px">
				<label htmlFor="">
					<b>{t('externalUrl')}</b>
					<input
						type="text"
						{...getFieldProps(`projects.${projectId}.metadata.externalUrl`)}
					/>
				</label>
				<label htmlFor="">
					<b>{t('description')}</b>
					<textarea
						{...getFieldProps(`projects.${projectId}.metadata.description`)}
					/>
				</label>
				<label htmlFor="">
					<b>{t('name')}</b>
					<input
						type="text"
						{...getFieldProps(`projects.${projectId}.metadata.name`)}
					/>
				</label>
			</Flex>
		</>
	)
}

export default Token
