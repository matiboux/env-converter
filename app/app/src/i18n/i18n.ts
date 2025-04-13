import { i18n as i18nConfig } from '~/config'
import type { Locales, I18nKeys } from './type'

export const defaultLocale = i18nConfig.defaultLocale

export const locales = new Set(i18nConfig.locales.map(locale => typeof locale === 'string' ? locale : locale.path))

export function i18n(
	locale: Locales | undefined,
	keys: I18nKeys | string,
	...args: any[]
): string
{
	const value = typeof keys === 'string'
		? ((i18nConfig.localeKeys?.[locale!] ?? i18nConfig.localeKeys?.[defaultLocale])?.[keys] ?? keys)
		: (keys[locale!] ?? keys[defaultLocale] ?? Object.values(keys)[0] ?? '')

	if (!value)
	{
		return value
	}

	if (args.length >= 1)
	{
		if (typeof args[0] === 'object')
		{
			// Arguments are passed as a dictionary
			return value.replaceAll(
				/{([^}]+)}/g,
				(match, key) => String(args[0][key] ?? match),
			)
		}

		// Arguments are passed as an array
		return value.replaceAll(
			/{(\d+)}/g,
			(match, number) => String(args[Number.parseInt(number)] ?? match),
		)
	}

	return value
}
