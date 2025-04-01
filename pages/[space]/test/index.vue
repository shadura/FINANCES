<script setup lang="ts">
import { Edit, Trash, ChevronUp, ChevronDown, MoveHorizontal, Scale, BanknoteArrowDown } from 'lucide-vue-next'
import getPeriodList from '@/utils/getPeriodList'
import { SECONDARY_CURRENCY, PRIMARY_CURRENCY } from '@/const/currency.const'

const numericSpaceId = Number(useRoute().params.space)

const { period, getPlannedTags } = usePlans()
const { list: accountList, updateData: updatedAccountsData } = useAccounts()
const { list: tagsList, updateData: updateTagsData } = useTags()
const { convert } = useCurrency()

const periodList = getPeriodList()

const updateData = () => {}
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Test</h1>

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
									{{ useFormatAmount(1000, PRIMARY_CURRENCY) }}
								</div>
								<div class="text-xs">
									{{ useFormatAmount(convert(1000, PRIMARY_CURRENCY, SECONDARY_CURRENCY), SECONDARY_CURRENCY) }}
								</div>
							</div>

							<div>
								<div class="mb-1 text-sm text-muted-foreground">Left to spend</div>
								<div class="font-bold text-lg">
									{{ useFormatAmount(1500, PRIMARY_CURRENCY) }}
								</div>
								<div class="text-xs">
									{{ useFormatAmount(convert(1500, PRIMARY_CURRENCY, SECONDARY_CURRENCY), SECONDARY_CURRENCY) }}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				<TablesPlanList :period class="mt-4" />
			</div>

			<div>
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

						<ScrollArea class="h-80 w-full mt-4">
							<Popover>
								<PopoverTrigger as-child>
									<div class="flex items-center space-x-4 rounded-md border px-4 py-4 mb-2 cursor-pointer">
										<BanknoteArrowDown :size="24" />
										<div class="flex-1 space-y-1">
											<p class="text-sm font-medium leading-none">Mono Rose</p>

											<div class="mt-2">
												<Tag>food</Tag>
											</div>
											<p class="text-sm text-muted-foreground">Some description</p>
										</div>
										<div class="text-right">1 000 UAH</div>
									</div>
								</PopoverTrigger>
								<PopoverContent class="w-140">
									<FormsTransaction :accountList :tagsList :numericSpaceId @sent="updateData" />
								</PopoverContent>
							</Popover>
						</ScrollArea>
					</CardContent>
				</Card>

				<WidgetsPlannedTagsStat />
			</div>
		</div>
	</div>
</template>
