<script setup lang="ts">
import ApexCharts from 'apexcharts'

const props = defineProps<{
	data: { value: number; label: string; color?: string }[]
}>()

const COLORS = ['#C599B6', '#205781', '#FAD0C4', '#4F959D', '#EAD196', '#007074', '#F38C79']

const colors = computed(() => {
	return props.data.map((item, idx) => {
		if (!item.color || item.color === 'default') return COLORS[idx]

		return item.color
	})
})

const series = computed(() => {
	return props.data.map((item) => item.value)
})

const labels = computed(() => {
	return props.data.map((item) => item.label)
})

const getChartOptions = computed(() => {
	return {
		series: [
			{
				data: series.value,
			},
		],
		colors: colors.value,
		chart: {
			height: 420,
			width: '100%',
			type: 'bar',
		},
		stroke: {
			colors: ['white'],
			lineCap: '',
		},
		plotOptions: {
			bar: {
				borderRadius: 4,
				borderRadiusApplication: 'end',
				horizontal: true,
			},
		},
		labels: labels.value,
		dataLabels: {
			enabled: true,
			style: {
				fontFamily: 'ui-sans-serif, system-ui, sans-serif',
			},
		},
		legend: {
			position: 'bottom',
			fontFamily: 'ui-sans-serif, system-ui, sans-serif',
		},
		// yaxis: {
		// 	labels: {
		// 		formatter: function (value: any) {
		// 			return value + '%'
		// 		},
		// 	},
		// },
		xaxis: {
			categories: labels.value,
			labels: {
				formatter: function (value: any) {
					return value + 'test'
				},
			},
			// axisTicks: {
			// 	show: false,
			// },
			// axisBorder: {
			// 	show: false,
			// },
		},
	}
})

const initChart = () => {
	if (document.getElementById('pie-chart') && typeof ApexCharts !== 'undefined') {
		const chart = new ApexCharts(document.getElementById('pie-chart'), getChartOptions.value)
		chart.render()
	}
}

watch(
	getChartOptions,
	() => {
		initChart()
	},
	{ immediate: true },
)
</script>

<template>
	<div>
		<div id="pie-chart"></div>
	</div>
</template>
