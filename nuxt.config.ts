import { fileURLToPath } from 'url'

export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', 'shadcn-nuxt'],
	supabase: {
		// Options
		redirectOptions: {
			login: '/auth',
			callback: '/auth/callback',
			exclude: ['/auth', '/auth/callback'],
		},
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

	alias: {
		'@Budget': fileURLToPath(new URL('./modules/Budget', import.meta.url)),
		'@NetWorth': fileURLToPath(new URL('./modules/NetWorth', import.meta.url)),
	},

	extends: ['./modules/Budget', './modules/NetWorth'],

	routeRules: {
		'/**': { ssr: false, cache: false, headers: { 'cache-control': 'no-store' } },
	},
})
