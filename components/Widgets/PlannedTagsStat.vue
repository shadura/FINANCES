<script setup lang="ts">
import { SECONDARY_CURRENCY } from '@/const/currency.const'

const { getPlannedTags, isListLoading } = usePlans()
const { convert } = useCurrency()
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>Planned tags amounts</CardTitle>
			<CardDescription>Here you can see planned tags amounts for selected period.</CardDescription>
		</CardHeader>
		<CardContent>
			<div v-if="isListLoading">
				<Loader />
			</div>

			<ul v-else class="mt-4">
				<li v-for="tag in getPlannedTags" :key="tag.tag.id" class="flex gap-1 justify-between mb-2 pb-2 border-b">
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
		</CardContent>
	</Card>
</template>
