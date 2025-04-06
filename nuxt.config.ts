export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxtjs/supabase', 'shadcn-nuxt', '@vite-pwa/nuxt'],
	supabase: {
		// Options
		redirectOptions: {
			login: '/auth',
			callback: '/auth/callback',
			exclude: ['/auth', '/auth/callback'],
		},
	},

	pwa: {
		strategies: 'generateSW',
		registerType: 'autoUpdate',
		manifest: {
			name: 'Finance',
			short_name: 'Finance',
			theme_color: '#ffffff',
			icons: [
				{
					src: '/icons/android/android-launchericon-512-512.png',
					sizes: '512x512',
					type: 'image/png',
				},
				{
					src: '/icons/android/android-launchericon-192-192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/icons/android/android-launchericon-144-144.png',
					sizes: '144x144',
					type: 'image/png',
				},
				{
					src: '/icons/android/android-launchericon-96-96.png',
					sizes: '96x96',
					type: 'image/png',
				},
				{
					src: '/icons/android/android-launchericon-72-72.png',
					sizes: '72x72',
					type: 'image/png',
				},
				{
					src: '/icons/android/android-launchericon-48-48.png',
					sizes: '48x48',
					type: 'image/png',
				},
				{
					src: '/icons/ios/16.png',
					sizes: '16x16',
					type: 'image/png',
				},
				{
					src: '/icons/ios/20.png',
					sizes: '20x20',
					type: 'image/png',
				},
				{
					src: '/icons/ios/29.png',
					sizes: '29x29',
					type: 'image/png',
				},
				{
					src: '/icons/ios/32.png',
					sizes: '32x32',
					type: 'image/png',
				},
				{
					src: '/icons/ios/40.png',
					sizes: '40x40',
					type: 'image/png',
				},
				{
					src: '/icons/ios/50.png',
					sizes: '50x50',
					type: 'image/png',
				},
				{
					src: '/icons/ios/57.png',
					sizes: '57x57',
					type: 'image/png',
				},
				{
					src: '/icons/ios/58.png',
					sizes: '58x58',
					type: 'image/png',
				},
				{
					src: '/icons/ios/60.png',
					sizes: '60x60',
					type: 'image/png',
				},
				{
					src: '/icons/ios/64.png',
					sizes: '64x64',
					type: 'image/png',
				},
				{
					src: '/icons/ios/72.png',
					sizes: '72x72',
					type: 'image/png',
				},
				{
					src: '/icons/ios/76.png',
					sizes: '76x76',
					type: 'image/png',
				},
				{
					src: '/icons/ios/80.png',
					sizes: '80x80',
					type: 'image/png',
				},
				{
					src: '/icons/ios/87.png',
					sizes: '87x87',
					type: 'image/png',
				},
				{
					src: '/icons/ios/100.png',
					sizes: '100x100',
					type: 'image/png',
				},
				{
					src: '/icons/ios/114.png',
					sizes: '114x114',
					type: 'image/png',
				},
				{
					src: '/icons/ios/120.png',
					sizes: '120x120',
					type: 'image/png',
				},
				{
					src: '/icons/ios/128.png',
					sizes: '128x128',
					type: 'image/png',
				},
				{
					src: '/icons/ios/144.png',
					sizes: '144x144',
					type: 'image/png',
				},
				{
					src: '/icons/ios/152.png',
					sizes: '152x152',
					type: 'image/png',
				},
				{
					src: '/icons/ios/167.png',
					sizes: '167x167',
					type: 'image/png',
				},
				{
					src: '/icons/ios/180.png',
					sizes: '180x180',
					type: 'image/png',
				},
				{
					src: '/icons/ios/192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/icons/ios/256.png',
					sizes: '256x256',
					type: 'image/png',
				},
				{
					src: '/icons/ios/512.png',
					sizes: '512x512',
					type: 'image/png',
				},
				{
					src: '/icons/ios/1024.png',
					sizes: '1024x1024',
					type: 'image/png',
				},
			],
		},
		client: {
			installPrompt: true,
			// you don't need to include this: only for testing purposes
			// if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
			periodicSyncForUpdates: 20,
		},
		devOptions: {
			enabled: true,
			suppressWarnings: true,
			navigateFallback: '/',
			navigateFallbackAllowlist: [/^\/$/],
			type: 'module',
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
				{ name: 'theme-color', content: '#ffffff' },
			],
		},
	},

	runtimeConfig: {
		public: {
			BUILD_TIME: new Date().toISOString(),
		},
	},

	routeRules: {
		'/**': { ssr: false, cache: false, headers: { 'cache-control': 'no-store' } },
	},
})
