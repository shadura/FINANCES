<script setup lang="ts">
import ApexCharts from 'apexcharts'
import type { ECurrency } from '@/types/enums/currency'
import dayjs from 'dayjs'

const props = defineProps<{
	data: { balance: number; date: string; color?: string }[]
	currency: string
}>()

const labels = computed(() => {
	return props.data.map((item) => dayjs(item.date).format('DD MMM'))
})

const series = computed(() => {
	return props.data.map((item) => item.balance)
})

const getChartOptions = computed(() => ({
	// set the labels option to true to show the labels on the X and Y axis
	xaxis: {
		show: true,
		categories: labels.value,
		labels: {
			show: true,
			style: {
				fontFamily: 'ui-sans-serif, system-ui, sans-serif',
				cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
			},
		},
		axisBorder: {
			show: false,
		},
		axisTicks: {
			show: false,
		},
	},
	yaxis: {
		show: true,
		labels: {
			show: true,
			style: {
				fontFamily: 'ui-sans-serif, system-ui, sans-serif',
				cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
			},
			formatter: function (value: number) {
				return useFormatAmount(value, props.currency as ECurrency)
			},
		},
	},
	series: [
		{
			name: '',
			data: series.value,
			color: '#1A56DB',
		},
	],
	// series: [
	// 	{
	// 		name: 'Developer Edition',
	// 		data: [150, 141, 145, 152, 135, 125],
	// 		color: '#1A56DB',
	// 	},
	// 	{
	// 		name: 'Designer Edition',
	// 		data: [43, 13, 65, 12, 42, 73],
	// 		color: '#7E3BF2',
	// 	},
	// ],
	chart: {
		sparkline: {
			enabled: false,
		},
		height: '100%',
		width: '100%',
		type: 'area',
		fontFamily: 'ui-sans-serif, system-ui, sans-serif',
		dropShadow: {
			enabled: false,
		},
		toolbar: {
			show: false,
		},
	},
	tooltip: {
		enabled: true,
		x: {
			show: false,
		},
	},
	fill: {
		type: 'gradient',
		gradient: {
			opacityFrom: 0.3,
			opacityTo: 0,
			shade: '#1C64F2',
			gradientToColors: ['#1C64F2'],
		},
	},
	dataLabels: {
		enabled: false,
	},
	stroke: {
		width: 6,
	},
	legend: {
		show: false,
	},
	grid: {
		show: false,
	},
}))

const chart = ref<any>(null)
const init = () => {
	console.log('init chart', document.getElementById('labels-chart'))
	if (document.getElementById('labels-chart') && typeof ApexCharts !== 'undefined') {
		chart.value = new ApexCharts(document.getElementById('labels-chart'), getChartOptions.value)
		console.log('chart in', chart.value)
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
			chart.value.updateOptions(getChartOptions.value)
		}, 100)
	},
)
</script>

<template>
	<div class="h-[500px]">
		<div id="labels-chart" class="px-2.5"></div>
	</div>
</template>
