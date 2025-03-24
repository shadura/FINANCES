export default defineNuxtRouteMiddleware((to) => {
	console.log('Auth middleware')
	const user = useSupabaseUser()
	console.log('Auth middleware 2', user)

	// Public pages that don't require authentication
	const publicPages = ['/auth', '/auth/callback']

	// Check if the page requires authentication
	const requiresAuth = !publicPages.includes(to.path)

	if (requiresAuth && !user.value) {
		// Redirect to auth page if user is not authenticated
		return navigateTo('/auth')
	}

	// If user is authenticated and trying to access auth page, redirect to home
	if (user.value && to.path === '/auth') {
		return navigateTo('/')
	}
})
