const i18n =
{
	defaultLocale: 'en',
	locales: [
		'en',
		'fr',
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
		}
	)[],
	readonly routing: {
		readonly prefixDefaultLocale: boolean,
	}
}

export default i18n
