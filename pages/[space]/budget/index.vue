<script setup lang="ts">
import { Edit, Trash, ChevronUp, ChevronDown, MoveHorizontal, Scale, BanknoteArrowDown } from 'lucide-vue-next'
import getPeriodList from '@/utils/getPeriodList'
import { SECONDARY_CURRENCY, PRIMARY_CURRENCY } from '@/const/currency.const'
import dayjs from 'dayjs'

const { getPlannedTags, getList: getPlans } = usePlans()
const { list: transactionList, getList: getTransactions, getSum: getTransactionsSum } = useTransactions()
const { list: accountList, getList: getAccounts } = useAccounts()
// const { list: tagsList, getList: getTags } = useTags()
const { convert } = useCurrency()

const periodList = getPeriodList()
const period = ref(dayjs().format('YYYY-MM-DD'))

const updateData = () => {
	getPlans(period.value)
	getTransactions(period.value)
	getAccounts()
	// updateTagsData()
}

watch(
	period,
	() => {
		updateData()
	},
	{ immediate: true },
)
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Budget</h1>

		<div class="mt-4">
			<Select v-model="period">
				<SelectTrigger class="w-[240px]">
					<SelectValue placeholder="Select a period" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Periods</SelectLabel>
						<SelectItem v-for="period in periodList" :key="period.value" :value="period.value">
							{{ period.name }}
						</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>

		<div class="grid grid-cols-2 gap-4 mt-8" style="grid-template-columns: 2fr 1fr">
			<div>
				<Card>
					<CardHeader>
						<CardTitle>Period summary</CardTitle>
						<CardDescription>Here you can see period summary.</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="grid grid-cols-5 items-center gap-8">
							<div>
								<div class="mb-1 text-sm text-muted-foreground">Planned Income</div>
								<div class="font-bold text-lg">
									{{ useFormatAmount(getPlannedTags.income.amount, PRIMARY_CURRENCY) }}
								</div>
								<div class="text-xs">
									{{
										useFormatAmount(
											convert(getPlannedTags.income.amount, PRIMARY_CURRENCY, SECONDARY_CURRENCY),
											SECONDARY_CURRENCY,
										)
									}}
								</div>
							</div>
							<div>
								<div class="mb-1 text-sm text-muted-foreground">Planned Expense</div>
								<div class="font-bold text-lg">
									{{ useFormatAmount(getPlannedTags.expense.amount, PRIMARY_CURRENCY) }}
								</div>
								<div class="text-xs">
									{{
										useFormatAmount(
											convert(getPlannedTags.expense.amount, PRIMARY_CURRENCY, SECONDARY_CURRENCY),
											SECONDARY_CURRENCY,
										)
									}}
								</div>
							</div>
							<div>
								<div class="mb-1 text-sm text-muted-foreground">Left to plan</div>
								<div class="font-bold text-lg">
									{{ useFormatAmount(getPlannedTags.income.amount - getPlannedTags.expense.amount, PRIMARY_CURRENCY) }}
								</div>
								<div class="text-xs">
									{{
										useFormatAmount(
											convert(
												getPlannedTags.income.amount - getPlannedTags.expense.amount,
												PRIMARY_CURRENCY,
												SECONDARY_CURRENCY,
											),
											SECONDARY_CURRENCY,
										)
									}}
								</div>
							</div>

							<div>
								<div class="mb-1 text-sm text-muted-foreground">Spent</div>
								<div class="font-bold text-lg">
									{{ useFormatAmount(getTransactionsSum.primary.value, PRIMARY_CURRENCY) }}
								</div>
								<div class="text-xs">
									{{
										useFormatAmount(
											convert(getTransactionsSum.primary.value, PRIMARY_CURRENCY, SECONDARY_CURRENCY),
											SECONDARY_CURRENCY,
										)
									}}
								</div>
							</div>

							<div>
								<div class="mb-1 text-sm text-muted-foreground">Left to spend</div>
								<div class="font-bold text-lg">
									{{
										useFormatAmount(getPlannedTags.expense.amount - getTransactionsSum.primary.value, PRIMARY_CURRENCY)
									}}
								</div>
								<div class="text-xs">
									{{
										useFormatAmount(
											convert(
												getPlannedTags.expense.amount - getTransactionsSum.primary.value,
												PRIMARY_CURRENCY,
												SECONDARY_CURRENCY,
											),
											SECONDARY_CURRENCY,
										)
									}}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<WidgetsPlan :period class="mt-4" />
			</div>

			<div>
				<WidgetsTransactions :period />
			</div>
		</div>
	</div>
</template>
