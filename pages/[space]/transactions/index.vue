<script setup lang="ts">
import getPeriodList from '@/utils/getPeriodList'

const { period } = useTransactions()

const periodList = getPeriodList()
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Transactions</h1>

		<div class="mt-4">
			<Select v-model="period">
				<SelectTrigger class="w-[240px]">
					<SelectValue placeholder="Select a period" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Periods</SelectLabel>
						<SelectItem v-for="period in periodList" :key="period.value" :value="period.value">
							{{ period.name }}
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>

		<div class="mt-8 grid grid-cols-2 gap-4" style="grid-template-columns: 2fr 1fr">
			<div>
				<TablesTransactionsList :period />
			</div>
			<div>
				<WidgetsAccountsInfo />
			</div>
		</div>
	</div>
</template>
