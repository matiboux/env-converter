import type { AstroConfig } from 'astro'

type I18nConfig = AstroConfig['i18n']

export const i18n: I18nConfig = {
	locales: [
		{
			codes: ['en', 'en_US'],
			path: 'en',
		},
		{
			codes: ['fr', 'fr_FR'],
			path: 'fr',
		},
	],
	defaultLocale: 'en',
	fallback: {
		fr: 'en',
	},
	routing: {
		prefixDefaultLocale: false,
		fallbackType: 'rewrite',
	},
}
