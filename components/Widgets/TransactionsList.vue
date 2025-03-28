<script setup lang="ts">
import { Edit, Trash, ChevronUp, ChevronDown, MoveHorizontal, Scale } from 'lucide-vue-next'
import type { Account, Tag, TransactionWithTags } from '~/types/index.types'
import { ETransactionType } from '~/types/enums/transaction'
import dayjs from 'dayjs'

const numericSpaceId = Number(useRoute().params.space)

const supabase = useSupabase()

const { data: accountList } = useAsyncData('accounts', async () => {
	const { data, error } = await supabase
		.from('accounts')
		.select('*')
		.eq('space_id', numericSpaceId)
		.eq('deleted', false)
		.order('created_at', { ascending: false })
	if (error) throw error
	return data as Account[]
})

const { data: tagsList } = useAsyncData('tags', async () => {
	const { data, error } = await supabase.from('tags').select('*').eq('space_id', numericSpaceId)
	if (error) throw error
	return data as Tag[]
})

const { data, refresh } = useAsyncData('transactions', async () => {
	const { data, error } = await supabase
		.from('transactions')
		.select(
			`
			*,
			transaction_tags (
				id,
				tags (
					id,
					name,
					color
				)
			)
		`,
		)
		.eq('space_id', numericSpaceId)
		.order('created_at', { ascending: false })

	if (error) throw error
	return data as unknown as TransactionWithTags[]
})

const deleteTransaction = async (id: number) => {
	if (!confirm('Are you sure you want to delete this transaction?')) return

	await supabase.from('transactions').delete().eq('id', id)
	await refresh()
}

const getAccountName = (id: number | null) => {
	if (!id) return ''

	const account = accountList.value?.find((account) => account.id === id)
	return account?.name || ''
}

const getAccountCurrency = (id: number | null) => {
	if (!id) return ''

	const account = accountList.value?.find((account) => account.id === id)
	return account?.currency || ''
}
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>Transaction list</CardTitle>
			<CardDescription>Manage your transactions here.</CardDescription>
		</CardHeader>
		<CardContent>
			<Popover>
				<PopoverTrigger as-child>
					<Button>Add transaction</Button>
				</PopoverTrigger>
				<PopoverContent class="w-140">
					<FormsTransaction :accountList :tagsList :numericSpaceId @sent="refresh" />
				</PopoverContent>
			</Popover>

			<Table class="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead class="w-[50px]">Type</TableHead>
						<TableHead> Account </TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Tags</TableHead>
						<TableHead>Date</TableHead>
						<TableHead class="text-right w-[100px]"> Actions </TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow v-for="transaction in data" :key="transaction.id">
						<TableCell>
							<MoveHorizontal v-if="transaction.type === ETransactionType.TRANSFER" :size="16" />
							<Scale v-if="transaction.type === ETransactionType.ADJUST" :size="16" />
							<ChevronDown v-if="transaction.type === ETransactionType.EXPENSE" color="red" :size="16" />
							<ChevronUp v-if="transaction.type === ETransactionType.INCOME" color="green" :size="16" />
						</TableCell>
						<TableCell class="font-medium">
							<template v-if="transaction.type === ETransactionType.TRANSFER">
								{{ getAccountName(transaction.account_from) }} → {{ getAccountName(transaction.account_to) }}
							</template>
							<template v-if="transaction.type === ETransactionType.ADJUST">
								{{ getAccountName(transaction.account_to) }}
							</template>
							<template v-if="transaction.type === ETransactionType.EXPENSE">
								{{ getAccountName(transaction.account_from) }}
							</template>
							<template v-if="transaction.type === ETransactionType.INCOME">
								{{ getAccountName(transaction.account_to) }}
							</template>
						</TableCell>
						<TableCell class="font-medium">
							<template v-if="transaction.type === ETransactionType.TRANSFER">
								{{ transaction.amount_debit || 0 }} {{ getAccountCurrency(transaction.account_from) }} →
								{{ transaction.amount_credit || 0 }} {{ getAccountCurrency(transaction.account_to) }}
							</template>
							<template v-if="transaction.type === ETransactionType.ADJUST">
								{{ transaction.amount_credit || 0 }} {{ getAccountCurrency(transaction.account_to) }}
							</template>
							<template v-if="transaction.type === ETransactionType.EXPENSE">
								{{ transaction.amount_debit || 0 }} {{ getAccountCurrency(transaction.account_from) }}
							</template>
							<template v-if="transaction.type === ETransactionType.INCOME">
								{{ transaction.amount_credit || 0 }} {{ getAccountCurrency(transaction.account_to) }}
							</template>
						</TableCell>
						<TableCell>
							<div class="flex gap-1">
								<Badge v-for="tag in transaction.transaction_tags" :key="tag.tags.id" variant="secondary">
									{{ tag.tags.name }}
								</Badge>
							</div>
						</TableCell>

						<TableCell>
							{{ dayjs(transaction.created_at).format('DD MMM') }}
						</TableCell>

						<TableCell class="text-right">
							<div class="flex gap-1 justify-end">
								<Popover>
									<PopoverTrigger as-child>
										<Button variant="ghost" size="icon">
											<Edit />
										</Button>
									</PopoverTrigger>
									<PopoverContent class="w-140">
										<FormsTransaction :transaction :accountList :tagsList :numericSpaceId @sent="refresh" />
									</PopoverContent>
								</Popover>

								<Button variant="ghost" size="icon" @click="deleteTransaction(transaction.id)">
									<Trash color="red" />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</CardContent>
	</Card>
</template>
