import { useTranslation } from 'react-i18next'

import { Main } from 'GlobalStyled'

function ErrorContainer() {
	const { t } = useTranslation()

	return (
		<Main center>
			<h1 style={{ fontSize: '2rem' }}>{t('screens.error.title')}</h1>
			<p style={{ marginTop: 'var(--space--large)' }}>
				{t('screens.error.body')}
			</p>
		</Main>
	)
}

export default ErrorContainer
