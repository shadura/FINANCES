<script setup lang="ts">
const { getNetWorhInfo, getList: getAccountsList } = useAccounts()

onMounted(() => {
	getAccountsList()
})
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Dashboard</h1>

		<div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr]">
			<div>
				<WidgetsNetWorthPie :data="getNetWorhInfo" />

				<WidgetsAccountsInfo class="mt-4" />
			</div>

			<div>
				<WidgetsNetWorthLine />
			</div>

			<!-- <div>
				<pre>{{ getNetWorhInfo }}</pre>
			</div> -->
		</div>
	</div>
</template>
