<script setup lang="ts">
import ApexCharts from 'apexcharts'
import type { ECurrency } from '@/types/enums/currency'
import { COLORS } from '@/const/colors.const'

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
		list: {
			amount: number | null
			currency: ECurrency
			name: string
			converted: {
				amount: number
				currency: ECurrency
			}
		}[]
	}
}>()

const series = computed(() => {
	return props.data.list.map((item) => item.amount)
})

const labels = computed(() => {
	return props.data.list.map((item) => item.name)
})

const getChartOptions = () => {
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
						},
						total: {
							showAlways: true,
							show: true,
							label: 'Net Worth',
							fontFamily: 'ui-sans-serif, system-ui, sans-serif',

							formatter: function () {
								return `${useFormatAmount(props.data.amount.primary.value, props.data.amount.primary.currency)}`
							},
						},
						value: {
							show: true,
							fontFamily: 'ui-sans-serif, system-ui, sans-serif',
							fontWeight: 'bold',
							offsetY: -20,
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
		},
		yaxis: {
			labels: {
				formatter: function (value: any) {
					return value
				},
			},
		},
		xaxis: {
			labels: {
				formatter: function (value: any) {
					return value
				},
			},
			axisTicks: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
		},
	}
}

const initChart = () => {
	if (document.getElementById('donut-chart') && typeof ApexCharts !== 'undefined') {
		const chart = new ApexCharts(document.getElementById('donut-chart'), getChartOptions())
		chart.render()

		// Get all the checkboxes by their class name
		const checkboxes = document.querySelectorAll('#devices input[type="checkbox"]')

		// Function to handle the checkbox change event
		function handleCheckboxChange(event: any, chart: any) {
			const checkbox = event.target
			if (checkbox.checked) {
				switch (checkbox.value) {
					case 'desktop':
						chart.updateSeries([15.1, 22.5, 4.4, 8.4])
						break
					case 'tablet':
						chart.updateSeries([25.1, 26.5, 1.4, 3.4])
						break
					case 'mobile':
						chart.updateSeries([45.1, 27.5, 8.4, 2.4])
						break
					default:
						chart.updateSeries([55.1, 28.5, 1.4, 5.4])
				}
			} else {
				chart.updateSeries([35.1, 23.5, 2.4, 5.4])
			}
		}

		// Attach the event listener to each checkbox
		checkboxes.forEach((checkbox) => {
			checkbox.addEventListener('change', (event) => handleCheckboxChange(event, chart))
		})
	}
}

// onMounted(() => {
// 	initChart()
// })

watch(
	() => props.data,
	() => {
		initChart()
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
				<div class="py-6" id="donut-chart"></div>
			</div>
		</CardContent>
	</Card>
</template>
