<script setup lang="ts">
import { BanknoteArrowDown, BanknoteArrowUp, ArrowLeftRight, Wrench } from 'lucide-vue-next'
import type { TransactionWithTags } from '@/types/index.types'
import { ETransactionType } from '@/types/enums/transaction'
import dayjs from 'dayjs'
import type { ECurrency } from '~/types/enums/currency'

const props = defineProps<{
	period: string
}>()

const numericSpaceId = Number(useRoute().params.space)

const { list: accountList, getList: getAccounts } = useAccounts()
const { list: tagsList, getList: getTags } = useTags()
const { list: transactionList, getList: getTransactions } = useTransactions()

const formatedTransactionList = computed(() => {
	if (!transactionList.value) return []

	return transactionList.value.reduce((acc, transaction) => {
		const formatedDate = dayjs(transaction.date).format('DD MMM')
		if (acc.some((item) => item.date === formatedDate)) {
			return acc.map((item) =>
				item.date === formatedDate
					? {
							...item,
							list: [...item.list, transaction],
					  }
					: item,
			)
		}

		return [
			...acc,
			{
				date: formatedDate,
				list: [transaction],
			},
		]
	}, [] as { date: string; list: TransactionWithTags[] }[])
})

const updateData = () => {
	getAccounts()
	getTags()
	getTransactions(props.period)
}

const getCardTittle = (transaction: TransactionWithTags) => {
	if (transaction.type === ETransactionType.INCOME && transaction.account_to_info) {
		return transaction.account_to_info.name
	}
	if (transaction.type === ETransactionType.TRANSFER && transaction.account_from_info && transaction.account_to_info) {
		return `${transaction.account_from_info.name} → ${transaction.account_to_info.name}`
	}

	if (transaction.type === ETransactionType.EXPENSE && transaction.account_from_info) {
		return transaction.account_from_info.name
	}

	if (transaction.type === ETransactionType.ADJUST && transaction.account_to_info) {
		return transaction.account_to_info.name
	}

	return '-'
}

const getAmount = (transaction: TransactionWithTags) => {
	if (transaction.type === ETransactionType.INCOME) {
		return useFormatAmount(transaction.amount_credit, transaction.account_to_info?.currency as ECurrency)
	}

	if (transaction.type === ETransactionType.EXPENSE) {
		return useFormatAmount(transaction.amount_debit, transaction.account_from_info?.currency as ECurrency)
	}

	if (transaction.type === ETransactionType.TRANSFER) {
		return `${useFormatAmount(
			transaction.amount_debit,
			transaction.account_from_info?.currency as ECurrency,
		)} → ${useFormatAmount(transaction.amount_credit, transaction.account_to_info?.currency as ECurrency)}`
	}

	if (transaction.type === ETransactionType.ADJUST) {
		return useFormatAmount(transaction.amount_credit, transaction.account_to_info?.currency as ECurrency)
	}

	return '-'
}
</script>

<template>
	<Card class="mb-4">
		<CardHeader>
			<CardTitle>Transactions</CardTitle>
			<CardDescription>Here you can see your transactions.</CardDescription>
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

			<ScrollArea class="h-96 w-full mt-4">
				<div v-for="stack in formatedTransactionList" :key="stack.date">
					<Separator class="text-sm font-medium leading-none text-center mt-6 mb-3" :label="stack.date" />

					<Popover v-for="transaction in stack.list" :key="transaction.id">
						<PopoverTrigger as-child>
							<div class="flex items-center space-x-4 rounded-md border px-4 py-4 mb-2 cursor-pointer">
								<BanknoteArrowDown v-if="transaction.type === ETransactionType.EXPENSE" :size="24" color="#ff3333" />
								<BanknoteArrowUp v-if="transaction.type === ETransactionType.INCOME" :size="24" color="#6cc070" />
								<ArrowLeftRight v-if="transaction.type === ETransactionType.TRANSFER" :size="24" />
								<Wrench v-if="transaction.type === ETransactionType.ADJUST" :size="24" />

								<div class="flex-1 space-y-1">
									<p class="text-sm font-medium leading-none">{{ getCardTittle(transaction) }}</p>

									<div class="mt-2">
										<Tag
											v-for="tag in transaction.transaction_tags"
											:key="tag.tags.id"
											:color="tag.tags.color"
											class="mr-1"
											>{{ tag.tags.name }}</Tag
										>
									</div>
									<p class="text-sm text-muted-foreground">{{ transaction.description }}</p>
								</div>
								<div class="text-xs text-right">
									{{ getAmount(transaction) }}
								</div>
							</div>
						</PopoverTrigger>
						<PopoverContent class="w-140">
							<FormsTransaction :transaction :accountList :tagsList :numericSpaceId @sent="updateData" />
						</PopoverContent>
					</Popover>
				</div>
			</ScrollArea>
		</CardContent>
	</Card>
</template>
