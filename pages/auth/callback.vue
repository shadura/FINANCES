<script setup lang="ts">
definePageMeta({
  layout: 'clean',
})

// This page will handle the OAuth callback
// Supabase will automatically handle the authentication flow
// and redirect to the home page once authenticated

const client = useSupabaseClient()

onMounted(async () => {
  const { error } = await client.auth.getSession()
  if (error) {
    console.error('Error during callback:', error)
    navigateTo('/auth')
  } else {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <p class="mt-4 text-gray-600">Authenticating...</p>
  </div>
</template>
