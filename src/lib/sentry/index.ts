/* eslint-disable no-console */
import * as Sentry from '@sentry/react'
import { Replay } from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import { useEffect } from 'react'
import {
	matchRoutes,
	useLocation,
	useNavigationType,
	createRoutesFromChildren,
} from 'react-router-dom'

import { IS_DEV } from 'lib/constants'

Sentry.init({
	release: __APP_VERSION__,
	dsn: 'https://12c3fd18611b4b9c956a1627e41fd6ef@o1250989.ingest.sentry.io/6777508',
	ignoreErrors: [
		// Safari web extension
		'safari-web-extension://',
		// Random plugins/extensions
		'top.GLOBALS',
		// See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
		'originalCreateNotification',
		'canvas.contentDocument',
		'MyApp_RemoveAllHighlights',
		'http://tt.epicplay.com',
		"Can't find variable: ZiteReader",
		'jigsaw is not defined',
		'ComboSearch is not defined',
		'http://loading.retry.widdit.com/',
		'atomicFindClose',
		// Facebook borked
		'fb_xd_fragment',
		// ISP "optimizing" proxy - `Cache-Control: no-transform` seems to reduce this. (thanks @acdha)
		// See http://stackoverflow.com/questions/4113268/how-to-stop-javascript-injection-from-vodafone-proxy
		'bmi_SafeAddOnload',
		'EBCallBackMessageReceived',
		// See http://toolbar.conduit.com/Developer/HtmlAndGadget/Methods/JSInjection.aspx
		'conduitPage',
		// Generic error code from errors outside the security sandbox
		// You can delete this if using raven.js > 1.0, which ignores these automatically.
		'Script error.',
		// Avast extension error
		'_avast_submit',
	],
	integrations: [
		new BrowserTracing({
			tracingOrigins: [/^\//],
			routingInstrumentation: Sentry.reactRouterV6Instrumentation(
				useEffect,
				useLocation,
				useNavigationType,
				createRoutesFromChildren,
				matchRoutes as any,
			),
		}),
		new Replay({ maskAllText: true, blockAllMedia: true }),
	],
	environment: IS_DEV ? 'development' : 'production',
	replaysOnErrorSampleRate: 1.0,
	tracesSampleRate: 1.0,
	beforeSend(event, hint) {
		if (IS_DEV) {
			console.warn('⚠️ Captured error')
			console.dir(event)
			console.dir(hint)
			return null
		}

		return event
	},
})
