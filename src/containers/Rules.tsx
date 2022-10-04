import { useTranslation } from 'react-i18next'

function Rules() {
	const { t } = useTranslation()

	return (
		<div>
			<h2>{t('rules')}</h2>
			<p>Coming soon...</p>
		</div>
	)
}

export default Rules
