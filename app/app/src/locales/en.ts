import type { I18nKeys } from '~/i18n/type'

const defaultLocale =
[
	// Index
	'Online conversion tool for environment files.',
	// AppForm
	'Input type',
	'Output type',
	'.env file',
	'JSON',
	'JSON (inline)',
	'JSON (formatted)',
	'TOML',
	'Docker .env file',
	'Azure',
	'Input value',
	'Convert',
	'Reset',
	'Output value',
	'Swap',
	'Copy',
	// Footer
	'Open source project',
	'See the source code on {0}',
	'Built with {0}, served by {1}',
	'Made with love by {0}',
	'Data privacy',
	'No data is collected or processed over the network or on any server.',
	'All data is processed locally in your browser, and stays on your own device.',
	'This website uses no cookies and does no tracking.',
] as const satisfies Array<I18nKeys[keyof I18nKeys]>

export type LocaleKeys = typeof defaultLocale[number]
export type LocaleType = { [key in LocaleKeys]: key }

// Default locale uses the key as the value
const locale = defaultLocale
	.reduce<LocaleType>((acc, key) =>
		{
			(acc as any)[key] = key
			return acc
		},
		{} as LocaleType,
	)

export default locale
