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
		preference: 'light',
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
			charset: 'utf-8',
			viewport: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1',
			meta: [
				{ charset: 'utf-8' },
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1',
				},
				{ name: 'apple-mobile-web-app-capable', content: 'yes' },
				{ name: 'mobile-web-app-capable', content: 'yes' },
			],
		},
	},

	routeRules: {
		'/**': { ssr: false, cache: false, headers: { 'cache-control': 'no-store' } },
	},
})
