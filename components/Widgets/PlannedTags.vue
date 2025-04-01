<script setup lang="ts">
import { SECONDARY_CURRENCY } from '@/const/currency.const'

const { getPlannedTags } = usePlans()
const { convert } = useCurrency()
</script>

<template>
	<ul v-if="getPlannedTags.expense.list.length" class="mt-4">
		<li
			v-for="tag in getPlannedTags.expense.list"
			:key="tag.tag.id"
			class="flex gap-1 justify-between mb-2 pb-2 border-b"
		>
			<div>
				<Tag :color="tag.tag.color">
					{{ tag.tag.name }}
				</Tag>
			</div>

			<div class="flex justify-end items-center">
				<div>
					<div class="text-xs text-right">{{ useFormatAmount(tag.amount, tag.currency) }}</div>
					<div class="text-xs text-right">
						{{ useFormatAmount(convert(tag.amount, tag.currency, SECONDARY_CURRENCY), SECONDARY_CURRENCY) }}
					</div>
				</div>
				<div class="ml-1 border-l pl-1 w-16" style="line-height: 32px">{{ tag.persent }}%</div>
			</div>
		</li>
	</ul>
</template>
