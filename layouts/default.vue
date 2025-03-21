<template>
  <div class="min-h-screen">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div class="flex items-center space-x-6">
          <h1 class="text-xl font-bold text-gray-900">FIN_BUT</h1>
          <nav v-if="user" class="flex space-x-4">
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</NuxtLink>
            <NuxtLink to="/budget" class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Budget</NuxtLink>
          </nav>
        </div>
        <div v-if="user">
          <Button variant="outline" @click="signOut">Sign Out</Button>
        </div>
      </div>
    </header>
    <main>
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
const client = useSupabaseClient()

const signOut = async () => {
  await client.auth.signOut()
  navigateTo('/auth')
}
</script>
