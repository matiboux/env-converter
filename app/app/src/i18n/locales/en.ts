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
	'Azure',
	'Input value',
	'Convert',
	'Clear',
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
] as const

type Keys = typeof defaultLocale[number]
type Type = { [key in Keys]: key }

// Default locale uses the key as the value
const locale = defaultLocale
	.reduce<Type>((acc, key) =>
		{
			(acc as any)[key] = key
			return acc
		},
		{} as Type,
	)

export default locale as Readonly<typeof locale>
