import i18nConfig from '/config/i18n'

function getLocaleByPath(path: string): string | undefined
{
	for (const locale of i18nConfig.locales)
	{
		if (typeof locale !== 'string')
		{
			if (locale.path === path)
			{
				const code = locale.codes.at(0)
				return code
			}
		}
		else if (locale === path)
		{
			return locale
		}
	}

	return undefined
}

export default getLocaleByPath
