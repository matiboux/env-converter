import i18nConfig from '/config/i18n'
import getLocaleByPath from './getLocaleByPath'

const defaultLocale = i18nConfig.defaultLocale

function getLocaleByUrl(url: URL | string, fallback?: true): string
function getLocaleByUrl(url: URL | string, fallback: false): string | undefined
function getLocaleByUrl(url: URL | string, fallback: boolean = true): string | undefined
{
	const urlParts = typeof url === 'string' ? url.split('/') : url.pathname.split('/')
	for (const part of urlParts)
	{
		const locale = getLocaleByPath(part)
		if (locale)
		{
			return locale
		}
	}

	return fallback ? defaultLocale : undefined
}

export default getLocaleByUrl
