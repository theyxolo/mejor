import { useField } from 'formik'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { Flex } from 'components/system'

function Artwork() {
	const { t } = useTranslation()

	const { projectId } = useParams()
	const [dimensionsProps] = useField(`projects.${projectId}.artwork.dimensions`)
	const [formatProps] = useField(`projects.${projectId}.artwork.format`)

	return (
		<>
			<h2>{t('artwork')}</h2>
			<Flex gap="var(--space--medium)" flexDirection="column" maxWidth="600px">
				<label htmlFor="">
					<b>{t('dimensions')}</b>
					<input type="number" {...dimensionsProps} />
				</label>
				<label htmlFor="">
					<b>{t('format')}</b>
					<select {...formatProps}>
						<option value="">{t('useInput')}</option>
						<option value="png">PNG</option>
						<option value="jpeg">JPEG</option>
						<option value="webp">WebP</option>
					</select>
				</label>
			</Flex>
		</>
	)
}

export default Artwork
