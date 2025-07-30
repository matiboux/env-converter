import type { Diff } from '~/i18n/types.d.ts'

import type { DefaultLocaleKeys } from './types.d.ts'

const locale = {
	// Index
	'Online conversion tool for environment files.': 'Outil de conversion en ligne pour les fichiers d\'environnement.',
	// AppForm
	'Input type': 'Type d\'entrée',
	'Output type': 'Type de sortie',
	'.env file': 'Fichier .env',
	'JSON': 'JSON',
	'JSON (inline)': 'JSON (compacté)',
	'JSON (formatted)': 'JSON (formaté)',
	'TOML': 'TOML',
	'Docker .env file': 'Docker .env file',
	'Azure App Settings': 'Azure App Settings',
	'Invalid Azure App Settings format': 'Format Azure App Settings invalide',
	'Invalid Azure App Settings item format': 'Format d\'élément Azure App Settings invalide',
	'Input value': 'Valeur d\'entrée',
	'Convert': 'Convertir',
	'Reset': 'Réinitialiser',
	'Output value': 'Valeur de sortie',
	'Swap': 'Échanger',
	'Copy': 'Copier',
	// Footer
	'Open source project': 'Projet open source',
	'See the source code on {0}': 'Voir le code source sur {0}',
	'Built with {0}, served by {1}': 'Construit avec {0}, servi par {1}',
	'Made with love by {0}': 'Créé avec amour par {0}',
	'Data privacy': 'Confidentialité des données',
	'No data is collected or processed over the network or on any server.':
		'Aucune donnée n\'est collectée ou traitée sur le réseau ou sur un serveur.',
	'All data is processed locally in your browser, and stays on your own device.':
		'Toutes les données sont traitées localement dans votre navigateur et restent sur votre propre appareil.',
	'This website uses no cookies and does no tracking.':
		'Ce site web n\'utilise pas de cookies et ne fait pas de suivi.',
} as const

export default locale satisfies
	// Static type check for missing keys
	Readonly<Record<Diff<DefaultLocaleKeys, keyof typeof locale>, string>> &
	// Static type check for extra keys
	Readonly<Record<Diff<keyof typeof locale, DefaultLocaleKeys>, never>>
