import type { I18n, Diff } from '../type'

const locale =
{
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
	'Azure': 'Azure',
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

// Static type check
export default locale satisfies
	// Check for missing keys:
	Readonly<Record<Diff<keyof I18n, keyof typeof locale>, string>> &
	// Check for extra keys:
	Readonly<Record<Diff<keyof typeof locale, keyof I18n>, never>>
