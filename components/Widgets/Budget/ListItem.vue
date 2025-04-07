<script setup lang="ts">
import type { Account, PlanWithTags, Tag } from '~/types/index.types'
import { EllipsisVertical, CornerDownRight, Plus, ChevronsUpDown } from 'lucide-vue-next'
import getFormatedDescription from '@/utils/getFormatedDescription'
import { ETransactionType } from '~/types/enums/transaction'
import type { ECurrency } from '~/types/enums/currency'

const props = defineProps<{
	plan: PlanWithTags
	tagsList: Tag[]
	accountList: Account[]
	numericSpaceId: number
	period: string
}>()

const emit = defineEmits(['sent:transaction', 'delete:transaction', 'sent:plan', 'delete:plan'])

const { markAsDone } = usePlans()
const { getTransactionsByPlanId } = useTransactions()
const { convert } = useCurrency()

const transactions = getTransactionsByPlanId(props.plan.id)

const getTransactionsSum = computed(() => {
	if (props.plan.is_income) {
		return transactions.value.reduce((acc, transaction) => {
			return (
				acc +
				convert(
					transaction.amount_credit || 0,
					transaction.account_to_info?.currency as ECurrency,
					props.plan.currency as ECurrency,
				)
			)
		}, 0)
	}

	return transactions.value.reduce((acc, transaction) => {
		if (transaction.type === ETransactionType.EXPENSE || transaction.type === ETransactionType.TRANSFER) {
			return (
				acc +
				convert(
					transaction.amount_debit || 0,
					transaction.account_from_info?.currency as ECurrency,
					props.plan.currency as ECurrency,
				)
			)
		}
		return acc
	}, 0)
})

// * Transaction
const isCollapsibleOpen = ref(false)

const handleTransactionCreated = () => {
	isCollapsibleOpen.value = true
	emit('sent:transaction')
}

// * Plan
const openEdit = ref(false)
const isOpenning = ref(false)
const handleOpenPlanPopover = () => {
	isOpenning.value = true
	openEdit.value = true

	setTimeout(() => {
		isOpenning.value = false
	}, 500)
}
const handleIpdatePlanPopover = (value: boolean) => {
	if (!value && !isOpenning.value) openEdit.value = value
}

const handlePlanEdited = () => {
	openEdit.value = false
	emit('sent:plan')
}

const handleDelete = () => {
	emit('delete:plan', props.plan.id)
}
</script>

<template>
	<div class="border rounded-md pl-3 pr-0 py-3">
		<Collapsible v-model:open="isCollapsibleOpen">
			<div class="flex items-center justify-between" @click="isCollapsibleOpen = !isCollapsibleOpen">
				<div class="left flex gap-2 justify-start items-center">
					<div class="info">
						<div class="flex gap-2 justify-start items-center flex-wrap">
							<Tag v-for="tag in plan.plan_tags" :key="tag.tags.id" :color="tag.tags.color">
								{{ tag.tags.name }}
							</Tag>
						</div>

						<div v-if="plan.id" class="account mt-0.5 flex items-center gap-1 justify-start ml-2.5 mb-2">
							<CornerDownRight :size="14" />
							<span>{{ plan.preferred_account_info?.name || '-' }}</span>
						</div>

						<div v-if="plan.description" class="description text-sm text-muted-foreground italic">
							<span v-html="getFormatedDescription(plan.description)" />
						</div>
					</div>
				</div>

				<div class="right flex items-center justify-end gap-1" @click.stop>
					<div class="text-right whitespace-nowrap">
						<div>{{ useFormatAmount(plan.amount, plan.currency as ECurrency) }}</div>

						<div
							:class="{
								'text-destructive': getTransactionsSum > plan.amount && props.plan?.id,
							}"
						>
							{{ useFormatAmount(getTransactionsSum, plan.currency as ECurrency) }}
						</div>
					</div>

					<Popover>
						<PopoverTrigger as-child>
							<Button variant="outline" size="icon" class="cursor-pointer rounded-full ml-1 relative">
								<Plus :size="14" />
								<span
									v-if="transactions.length"
									class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
									>{{ transactions.length }}</span
								>
							</Button>
						</PopoverTrigger>
						<PopoverContent class="w-140">
							<FormsTransaction :accountList :tagsList :numericSpaceId :plan @sent="handleTransactionCreated" />
						</PopoverContent>
					</Popover>

					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant="ghost" size="icon" class="cursor-pointer"><EllipsisVertical /></Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem v-if="plan.id" @click="handleOpenPlanPopover">Edit</DropdownMenuItem>
							<DropdownMenuItem @click="isCollapsibleOpen = !isCollapsibleOpen">Toggle transactions</DropdownMenuItem>
							<DropdownMenuItem v-if="plan.id" @click="markAsDone(plan.id)">Mark as done</DropdownMenuItem>
							<DropdownMenuSeparator v-if="plan.id" />
							<DropdownMenuItem v-if="plan.id" class="text-red-500" @click="handleDelete">Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Popover :open="openEdit" @update:open="handleIpdatePlanPopover">
						<PopoverTrigger as-child> <div></div></PopoverTrigger>
						<PopoverContent class="w-140">
							<FormsPlan :tagsList :accountList :numericSpaceId :period="props.period" :plan @sent="handlePlanEdited" />
						</PopoverContent>
					</Popover>
				</div>
			</div>

			<CollapsibleContent class="space-y-2">
				<WidgetsTransaction
					v-for="transaction in transactions"
					:key="transaction.id"
					:transaction
					:tagsList
					:accountList
					:numericSpaceId
					@sent="emit('sent:transaction')"
					@delete="(id) => emit('delete:transaction', id)"
				/>

				<p v-if="!transactions.length" class="text-muted-foreground text-sm text-center italic">No transactions yet</p>
			</CollapsibleContent>
		</Collapsible>
	</div>
</template>
