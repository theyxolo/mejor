import * as i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import { IS_DEV } from 'lib/constants'

import enTranslation from './translations/en.json'
import esTranslation from './translations/es.json'

const resources = {
	en: {
		translation: enTranslation,
	},
	es: {
		translation: esTranslation,
	},
}

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: 'en',
		debug: IS_DEV,
		interpolation: {
			escapeValue: false,
		},
	})
export default i18n
