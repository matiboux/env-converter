import i18nConfig from '/config/i18n'

import defaultLocaleData from './locales/en'

const defaultLocale = i18nConfig.defaultLocale

const defaultLocaleKey = 'en' as const

type I18n = Readonly<Record<keyof typeof defaultLocaleData, string>>

type Diff<T, U> = T extends U ? never : T

export {
	defaultLocale,
	defaultLocaleKey,
}

export type {
	I18n,
	Diff,
}
