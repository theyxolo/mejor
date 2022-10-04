import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'

import { IS_DEV } from 'lib/constants'

Sentry.init({
	dsn: 'https://12c3fd18611b4b9c956a1627e41fd6ef@o1250989.ingest.sentry.io/6777508',
	integrations: [new BrowserTracing()],
	environment: IS_DEV ? 'development' : 'production',
	tracesSampleRate: 1.0,
	beforeSend(event, hint) {
		if (IS_DEV) {
			// eslint-disable-next-line no-console
			console.log(event, hint)
			return null
		}

		return event
	},
})
