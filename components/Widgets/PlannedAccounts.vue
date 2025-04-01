<script setup lang="ts">
import { SECONDARY_CURRENCY } from '@/const/currency.const'

const { getPlannedTags } = usePlans()
const { convert } = useCurrency()
</script>

<template>
	<ul v-if="getPlannedTags.byAccounts.length" class="mt-4">
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
						{{ useFormatAmount(convert(account.amount, account.currency, SECONDARY_CURRENCY), SECONDARY_CURRENCY) }}
					</div>
				</div>
			</div>
		</li>
	</ul>
</template>
