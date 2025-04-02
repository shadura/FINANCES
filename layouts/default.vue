<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
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
					</template>
				</Switch>
			</div>

			<div class="pt-6 sm:px-6 lg:px-8 w-full pb-6"><slot /></div>
		</main>
	</SidebarProvider>
</template>
