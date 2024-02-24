import getLocaleByPath from './getLocaleByPath'

function getUrlWithoutLocale(url: URL | string): string
{
	const urlPathnames = []
	const urlParts = typeof url === 'string' ? url.split('/') : url.pathname.split('/')

	let i = 0
	while (i < urlParts.length)
	{
		const locale = getLocaleByPath(urlParts[i] as string)
		if (locale)
		{
			i++
			continue
		}

		urlPathnames.push(urlParts[i])
		i++
	}
	while (i < urlParts.length)
	{
		urlPathnames.push(urlParts[i])
		i++
	}

	return urlPathnames.join('/')
}

export default getUrlWithoutLocale
