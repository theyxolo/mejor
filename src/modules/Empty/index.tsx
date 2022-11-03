import { useTranslation } from 'react-i18next'

function Empty() {
	const { t } = useTranslation()

	return (
		<div
			style={{
				flex: 1,
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				gap: 'var(--space--large)',
				opacity: 0.5,
			}}
		>
			<h3>{t('screens.empty.title')}</h3>
			<p>{t('screents.empty.description')}</p>
		</div>
	)
}

export default Empty
