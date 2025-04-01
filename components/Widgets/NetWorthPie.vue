<script setup lang="ts">
import ApexCharts from 'apexcharts'
import type { ECurrency } from '@/types/enums/currency'
import { COLORS } from '@/const/colors.const'

const { convert } = useCurrency()

interface Item {
	name: string
	amount: {
		primary: {
			value: number
			currency: ECurrency
		}
	}
}

const props = defineProps<{
	data: {
		amount: {
			primary: {
				value: number
				currency: ECurrency
			}
			secondary: {
				value: number
				currency: ECurrency
			}
		}
		byAccount: Item[]
		byType: Item[]
		byCurrency: Item[]
	}
}>()

const tab = ref<'byAccount' | 'byType' | 'byCurrency'>('byType')

const series = computed(() => {
	return props.data[tab.value].map((item) => item.amount.primary.value)
})

const labels = computed(() => {
	return props.data[tab.value].map((item) => item.name)
})

const colorMode = useColorMode()
const isDark = computed(() => colorMode.preference === 'dark')

const getChartOptions = computed(() => {
	return {
		series: series.value,
		colors: COLORS,
		chart: {
			height: 320,
			width: '100%',
			type: 'donut',
		},
		stroke: {
			colors: ['transparent'],
			lineCap: '',
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						name: {
							show: true,
							fontFamily: 'ui-sans-serif, system-ui, sans-serif',
							offsetY: 20,
							color: isDark.value ? '#FFFFFF' : '#000000',
						},
						total: {
							showAlways: true,
							show: true,
							label: `${useFormatAmount(props.data.amount.secondary.value, props.data.amount.secondary.currency)}`,
							fontFamily: 'ui-sans-serif, system-ui, sans-serif',
							color: isDark.value ? '#FFFFFF' : '#000000',

							formatter: function () {
								return `${useFormatAmount(props.data.amount.primary.value, props.data.amount.primary.currency)}`
							},
						},
						value: {
							show: true,
							fontFamily: 'ui-sans-serif, system-ui, sans-serif',
							fontWeight: 'bold',
							offsetY: -20,
							color: isDark.value ? '#FFFFFF' : '#000000',
							formatter: function (value: any) {
								return value
							},
						},
					},
					size: '80%',
				},
			},
		},
		grid: {
			padding: {
				top: -2,
			},
		},
		labels: labels.value,
		dataLabels: {
			enabled: false,
		},
		legend: {
			position: 'bottom',
			fontFamily: 'ui-sans-serif, system-ui, sans-serif',
			labels: {
				colors: isDark.value ? '#FFFFFF' : '#000000',
			},
		},
		yaxis: {
			labels: {
				formatter: function (value: any) {
					return Math.round((value / props.data.amount.primary.value) * 100 * 100) / 100 + '%'
				},
			},
		},
	}
})

const chart = ref<ApexCharts | null>(null)

const init = () => {
	if (document.getElementById('donut-chart') && typeof ApexCharts !== 'undefined') {
		chart.value = new ApexCharts(document.getElementById('donut-chart'), getChartOptions.value)
		chart.value.render()
	}
}

onMounted(() => {
	init()
})

watch(
	() => getChartOptions.value,
	() => {
		setTimeout(() => {
			if (chart.value) {
				chart.value.updateOptions(getChartOptions.value)
			}
		}, 100)
	},
	{ deep: true, immediate: true },
)
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>Net worth</CardTitle>
			<CardDescription>Here you can see your current net worth.</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="">
				<Tabs v-model="tab" class="w-full" @change="init">
					<TabsList>
						<TabsTrigger value="byType"> by Type </TabsTrigger>
						<TabsTrigger value="byCurrency"> by Currency </TabsTrigger>
						<TabsTrigger value="byAccount"> by Account </TabsTrigger>
					</TabsList>
				</Tabs>
				<div class="py-6" id="donut-chart"></div>
			</div>
		</CardContent>
	</Card>
</template>
