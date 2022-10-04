import { setUser } from '@sentry/react'
import { posthog } from 'posthog-js'

posthog.init('phc_RT5A2yOUDtIhzWeA3ncNNqNQuFkHqI7bKZn8EzSghwS', {
	api_host: 'https://app.posthog.com',
})

export function capture(name: string, properties?: object) {
	if (import.meta.env.DEV) return
	posthog.capture(name, properties)
}

export function identify(id: string) {
	if (import.meta.env.DEV) return
	setUser({ id })
	posthog.identify(id)
}
