const i18n =
{
	defaultLocale: 'en',
	locales: [
		{
			codes: ['en', 'en-US'],
			path: 'en',
			label: 'English',
			icon: '🇺🇸',
		},
		{
			codes: ['fr', 'fr-FR'],
			path: 'fr',
			label: 'Français',
			icon: '🇫🇷',
		},
	],
	routing: {
		prefixDefaultLocale: false,
	},
} as {
	readonly defaultLocale: string,
	readonly locales: readonly (
		| string
		| {
			readonly codes: readonly string[],
			readonly path: string,
			readonly label?: string,
			readonly icon?: string,
		}
	)[],
	readonly routing: {
		readonly prefixDefaultLocale: boolean,
	}
}

export default i18n
