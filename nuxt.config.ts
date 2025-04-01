export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxtjs/supabase', 'shadcn-nuxt'],
	supabase: {
		// Options
		redirectOptions: {
			login: '/auth',
			callback: '/auth/callback',
			exclude: ['/auth', '/auth/callback'],
		},
	},

	colorMode: {
		classSuffix: '',
	},

	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: '',
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: './components/ui',
	},

	app: {
		head: {
			title: 'Finance',
		},
	},

	routeRules: {
		'/**': { ssr: false, cache: false, headers: { 'cache-control': 'no-store' } },
	},
})
