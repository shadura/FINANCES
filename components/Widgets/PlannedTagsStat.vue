<script setup lang="ts">
import { SECONDARY_CURRENCY } from '@/const/currency.const'

const { getPlannedTags, isListLoading } = usePlans()
const { convert } = useCurrency()
</script>

<template>
	<Card v-if="getPlannedTags.byAccounts.length">
		<CardHeader>
			<CardTitle>Preferred account</CardTitle>
			<CardDescription>Here you can see preferred account to spend.</CardDescription>
		</CardHeader>
		<CardContent>
			<div>
				<ul class="mt-4">
					<li
						v-for="account in getPlannedTags.byAccounts"
						:key="account.account.id"
						class="flex gap-1 justify-between mb-2 pb-2 border-b"
					>
						<div>
							<Tag>
								{{ account.account.name }}
							</Tag>
						</div>

						<div class="text-right">
							<div>
								<div class="text-xs text-right">{{ useFormatAmount(account.amount, account.currency) }}</div>
								<div class="text-xs text-right">
									{{
										useFormatAmount(convert(account.amount, account.currency, SECONDARY_CURRENCY), SECONDARY_CURRENCY)
									}}
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</CardContent>
	</Card>

	<Card class="mt-4">
		<CardHeader>
			<CardTitle>Planned tags amounts</CardTitle>
			<CardDescription>Here you can see planned tags amounts for selected period.</CardDescription>
		</CardHeader>
		<CardContent>
			<div v-if="isListLoading">
				<Loader />
			</div>

			<ScrollArea v-else class="h-80 w-full">
				<ul class="mt-4">
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
			</ScrollArea>
		</CardContent>
	</Card>
</template>
