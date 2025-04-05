<script setup lang="ts">
import type { ECurrency } from '@/types/enums/currency'

const { list: accountsList, isListLoading } = useAccounts()

const splitedAccounts = computed(() => {
	return {
		netWorth: accountsList.value.filter((account) => account.is_net_worth),
		current: accountsList.value.filter((account) => !account.is_net_worth),
	}
})
</script>

<template>
	<Card>
		<CardHeader class="p-4 md:p-6">
			<CardTitle>Accounts</CardTitle>
			<CardDescription>Here you can see your accounts amounts.</CardDescription>
		</CardHeader>
		<CardContent class="p-4 md:p-6">
			<div v-if="isListLoading">
				<Loader />
			</div>

			<template v-else>
				<Separator class="my-4" label="Current" />

				<ul class="mt-4">
					<li
						v-for="account in splitedAccounts.current"
						:key="account.id"
						class="flex gap-1 justify-between mb-2 pb-2 border-b"
					>
						<div>
							<span class="inline-block mr-1">{{ account.name }}</span>
							<Tag>{{ account.type }}</Tag>
						</div>

						<div class="text-right">
							{{ useFormatAmount(account.balance || 0, account.currency as ECurrency) }}
						</div>
					</li>
				</ul>

				<Separator class="my-4" label="Net worth" />

				<ul class="mt-4">
					<li
						v-for="account in splitedAccounts.netWorth"
						:key="account.id"
						class="flex gap-1 justify-between mb-2 pb-2 border-b"
					>
						<div>
							<span class="inline-block mr-1">{{ account.name }}</span>
							<Tag>{{ account.type }}</Tag>
						</div>

						<div class="text-right">
							{{ useFormatAmount(account.balance || 0, account.currency as ECurrency) }}
						</div>
					</li>
				</ul>
			</template>
		</CardContent>
	</Card>
</template>
