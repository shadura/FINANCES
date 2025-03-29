<script setup lang="ts">
const { getCurrencyRates } = useCurrency()
await getCurrencyRates()
</script>

<template>
	<SidebarProvider>
		<AppSidebar />
		<main class="w-full">
			<SidebarTrigger />
			<div class="pt-6 sm:px-6 lg:px-8 w-full pb-6"><slot /></div>
		</main>
	</SidebarProvider>
</template>
