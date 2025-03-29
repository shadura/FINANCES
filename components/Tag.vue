<script setup lang="ts">
const props = defineProps<{
	color?: string
}>()

const textColor = computed(() => {
	if (!props.color || props.color === 'default') return '#000000'

	// Calculate whether to use black or white text based on background color brightness
	const hexColor = props.color && props.color !== 'default' ? props.color : '#ffffff'
	const r = parseInt(hexColor.slice(1, 3), 16) || 255
	const g = parseInt(hexColor.slice(3, 5), 16) || 255
	const b = parseInt(hexColor.slice(5, 7), 16) || 255
	// Calculate perceived brightness using the formula: (R * 0.299 + G * 0.587 + B * 0.114)
	const brightness = r * 0.299 + g * 0.587 + b * 0.114
	console.log('brightness', brightness)
	return brightness > 170 ? '#000000' : '#ffffff'
})
</script>

<template>
	<Badge
		variant="secondary"
		class="py-1"
		:style="{ backgroundColor: props.color && props.color !== 'default' ? props.color : '', color: textColor }"
	>
		<slot />
	</Badge>
</template>
