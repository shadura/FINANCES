<script setup lang="ts">
import { Edit, Trash, ChevronUp, ChevronDown, MoveHorizontal, Scale } from 'lucide-vue-next'
import { ETransactionType } from '~/types/enums/transaction'
import dayjs from 'dayjs'

const numericSpaceId = Number(useRoute().params.space)

const supabase = useSupabase()

const { list, isListLoading, updateData: updateTransactionsData } = useTransactions()
const { list: accountList, getAccountName, getAccountCurrency, updateData: updatedAccountsData } = useAccounts()
const { list: tagsList, updateData: updateTagsData } = useTags()

const updateData = async () => {
	await updateTransactionsData()
	await updatedAccountsData()
	await updateTagsData()
}

onMounted(() => {
	updateData()
})

const deleteTransaction = async (id: number) => {
	if (!confirm('Are you sure you want to delete this transaction?')) return

	await supabase.from('transactions').delete().eq('id', id)
	await updateData()
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
					<FormsTransaction :accountList :tagsList :numericSpaceId @sent="updateData" />
				</PopoverContent>
			</Popover>

			<div v-if="isListLoading">
				<Loader />
			</div>

			<Table v-else class="mt-4">
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
					<TableRow v-for="transaction in list" :key="transaction.id">
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
								{{ (transaction.amount_credit || 0) >= 0 ? '+' : '-' }} {{ transaction.amount_credit || 0 }}
								{{ getAccountCurrency(transaction.account_to) }}
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
								<Tag v-for="tag in transaction.transaction_tags" :key="tag.tags.id" :color="tag.tags.color">
									{{ tag.tags.name }}
								</Tag>
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
										<FormsTransaction :transaction :accountList :tagsList :numericSpaceId @sent="updateData" />
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
