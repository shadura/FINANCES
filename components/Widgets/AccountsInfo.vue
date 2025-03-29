<script setup lang="ts">
import type { ECurrency } from '@/types/enums/currency'

const { list: accountsList, isListLoading } = useAccounts()
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>Accounts</CardTitle>
			<CardDescription>Here you can see your accounts amounts.</CardDescription>
		</CardHeader>
		<CardContent>
			<div v-if="isListLoading">
				<Loader />
			</div>

			<ul v-else class="mt-4">
				<li v-for="account in accountsList" :key="account.id" class="flex gap-1 justify-between mb-2 pb-2 border-b">
					<div>
						<span class="inline-block mr-1">{{ account.name }}</span>
						<Tag>{{ account.type }}</Tag>
					</div>

					<div class="text-right">
						{{ useFormatAmount(account.balance || 0, account.currency as ECurrency) }}
					</div>
				</li>
			</ul>
		</CardContent>
	</Card>
</template>
