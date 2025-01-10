import { i18n as i18nConfig } from '~/config'
import type { Locales, I18nKeys } from './type'

import en from './locales/en'
import fr from './locales/fr'
type LocaleKeys = Readonly<Record<Locales, Readonly<Record<string, string>>>>
const localeKeys = { en, fr } satisfies LocaleKeys as LocaleKeys

const defaultLocale = i18nConfig.defaultLocale

const locales = new Set(i18nConfig.locales.map(locale => locale.path))

function i18n(
	locale: Locales | undefined,
	keys: I18nKeys | string,
	...args: any[]
)
{
	const value = typeof keys === 'string'
		? ((localeKeys[locale!] ?? localeKeys[defaultLocale])?.[keys] ?? keys)
		: (keys[locale!] ?? keys[defaultLocale])

	if (!value)
	{
		return value
	}

	if (args.length === 1 && typeof args[0] === 'object')
	{
		// Arguments are passed as an object
		args = args[0] as any
	}

	if (Array.isArray(args))
	{
		// Arguments are passed as an array
		return value?.replace(/{(\d+)}/g, (match, number) =>
			{
				const index = Number.parseInt(number)
				return String(args[index] ?? match)
			}
		)
	}

	// Arguments are passed as a dictionary
	return value?.replace(/{([^}]+)}/g, (match, key) =>
		{
			return String(args[key] ?? match)
		}
	)
}

export default i18n

export {
	defaultLocale,
	locales,
}
