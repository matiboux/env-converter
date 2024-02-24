import i18nConfig from '/config/i18n'

// https://github.com/matiboux/astro/blob/7a39ff4b49c252de1778efd5e62caab45e074550/packages/astro/src/i18n/index.ts#L163
function getLocaleByPath(path: string): string | undefined {
	for (const locale of i18nConfig.locales) {
		if (typeof locale !== 'string') {
			if (locale.path === path) {
				// the first code is the one that user usually wants
				const code = locale.codes.at(0);
				return code;
			}
		}
		else if (locale === path) {
			return locale;
		}
	}
	return undefined;
}

export default getLocaleByPath
