<script setup lang="ts">
import dayjs from 'dayjs'

interface IPeriod {
	value: number
	name: string
}

const { period } = usePlans()

const now = dayjs()
const periodList = computed<IPeriod[]>(() => {
	const result = []

	for (let i = 0; i < 3; i++) {
		result.push({
			value: Number(now.subtract(3 - i, 'month').format('MMYYYY')),
			name: `${now.subtract(3 - i, 'month').format('MMM YYYY')}${i === 2 ? ' - Prev month' : ''}`,
		})
	}

	result.push({
		value: Number(now.format('MMYYYY')),
		name: `${now.format('MMM YYYY')} - Current month`,
	})

	for (let i = 1; i < 7; i++) {
		result.push({
			value: Number(now.add(i, 'month').format('MMYYYY')),
			name: `${now.add(i, 'month').format('MMM YYYY')}${i === 1 ? ' - Next month' : ''}`,
		})
	}

	return result
})
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Planner</h1>

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
				<TablesPlanList :period />
			</div>

			<div>
				<WidgetsPlannedTagsStat />
			</div>
		</div>
	</div>
</template>
