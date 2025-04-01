<script setup lang="ts">
const { getCurrencyRates } = useCurrency()
await getCurrencyRates()

const colorMode = useColorMode()
const isDark = computed(() => colorMode.preference === 'dark')
const toggleTheme = () => {
	colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<template>
	<SidebarProvider>
		<AppSidebar />
		<main class="w-full">
			<div class="flex items-center justify-between py-2 pr-8 pl-2">
				<SidebarTrigger />

				<Switch :model-value="isDark" @update:model-value="toggleTheme">
					<template #thumb>
						<Icon v-if="isDark" icon="lucide:moon" class="size-3" />
						<Icon v-else icon="lucide:sun" class="size-3" />
					</template>
				</Switch>
			</div>

			<div class="pt-6 sm:px-6 lg:px-8 w-full pb-6"><slot /></div>
		</main>
	</SidebarProvider>
</template>
