<script setup lang="ts">
definePageMeta({
  layout: 'clean',
})

const client = useSupabaseClient()
const user = useSupabaseUser()

// Redirect to home if user is already authenticated
if (user.value) {
  navigateTo('/')
}

const signInWithGoogle = async () => {
  const { error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  
  if (error) {
    console.error('Error signing in with Google:', error)
  }
}
</script>

<template>
  <div class="w-full max-w-md">
    <Card class="w-full">
      <CardHeader>
        <CardTitle class="text-2xl text-center">Sign in</CardTitle>
        <CardDescription class="text-center">
          Sign in to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <Button 
            class="w-full flex items-center justify-center gap-2" 
            @click="signInWithGoogle"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-google">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              <path d="M12 16v-4m0 0V8m0 4h4m-4 0H8"/>
            </svg>
            Sign in with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
