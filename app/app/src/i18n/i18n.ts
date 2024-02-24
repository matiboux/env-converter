import en from './locales/en'
import fr from './locales/fr'
import { defaultLocaleKey, type I18n } from './type'

const locales = { en, fr } as const

function i18n(
	locale: keyof typeof locales,
	key: keyof I18n,
	...args: string[]
)
{
	const value = (locales[locale]?.[key] ?? key) as I18n[keyof I18n]

	if (typeof value !== 'string')
	{
		return value
	}

	return value.replace(/{(\d+)}/g, (match, number) =>
		{
			const index = Number.parseInt(number)
			return args[index] ?? match
		}
	)
}

type Tail<T extends any[]> = ((...args: T) => any) extends (arg: any, ...tail: infer U) => any ? U : never

function i18nFactory(locale: Parameters<typeof i18n>[0] | undefined)
{
	return (...args: Tail<Parameters<typeof i18n>>) => i18n(locale ?? defaultLocaleKey, ...args)
}

export default i18n

export {
	i18nFactory,
}
