<script setup lang="ts">
const props = defineProps<{
	color?: string
}>()

const textColor = computed(() => {
	if (!props.color || props.color === 'default') return ''

	let hex = props.color

	hex = hex.replace('#', '')

	// Convert 3-digit hex to 6-digit hex
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map((char) => char + char)
			.join('')
	}

	// Get the RGB values
	const r = parseInt(hex.substr(0, 2), 16)
	const g = parseInt(hex.substr(2, 2), 16)
	const b = parseInt(hex.substr(4, 2), 16)

	// Calculate the luminance
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

	// Return white or black based on luminance
	return luminance > 0.5 ? '#000000' : '#FFFFFF'
})
</script>

<template>
	<Badge
		variant="secondary"
		class="py-1 whitespace-nowrap"
		:style="{ backgroundColor: props.color && props.color !== 'default' ? props.color : '', color: textColor }"
	>
		<slot />
	</Badge>
</template>
