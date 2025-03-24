<script setup lang="ts">
import { getUserSpaces } from '~/api/spaces'

definePageMeta({
	layout: 'clean',
})

const spaces = await getUserSpaces()
</script>

<template>
	<div class="flex flex-col items-center">
		<div class="text-center">
			<h1 class="text-2xl font-bold mb-2">Spaces</h1>
			<p class="text-gray-600 mb-6">Select or create space</p>

			<nuxt-link
				v-for="space in spaces"
				:key="space.id"
				:to="`/${space.id}`"
				class="block mb-2 border rounded p-2 hover:bg-gray-100"
				>{{ space.name }}</nuxt-link
			>
		</div>
	</div>
</template>
