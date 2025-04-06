<script setup lang="ts">
import { EllipsisVertical, CornerDownRight } from 'lucide-vue-next'
import type { Account, Tag, TransactionWithTags } from '~/types/index.types'
import dayjs from 'dayjs'
import { ETransactionType } from '~/types/enums/transaction'
import type { ECurrency } from '~/types/enums/currency'
import getFormatedDescription from '@/utils/getFormatedDescription'

const props = defineProps<{
	transaction: TransactionWithTags
	tagsList: Tag[]
	accountList: Account[]
	numericSpaceId: number
}>()

const emit = defineEmits(['delete', 'sent'])

const getFormattedAccount = computed(() => {
	if (props.transaction.type === ETransactionType.INCOME && props.transaction.account_to_info) {
		return props.transaction.account_to_info.name
	}
	if (
		props.transaction.type === ETransactionType.TRANSFER &&
		props.transaction.account_from_info &&
		props.transaction.account_to_info
	) {
		return `${props.transaction.account_from_info.name} → ${props.transaction.account_to_info.name}`
	}

	if (
		(props.transaction.type === ETransactionType.EXPENSE || props.transaction.type === ETransactionType.LEGACY) &&
		props.transaction.account_from_info
	) {
		return props.transaction.account_from_info.name
	}

	if (props.transaction.type === ETransactionType.ADJUST && props.transaction.account_to_info) {
		return props.transaction.account_to_info.name
	}

	return '-'
})

const getFormattedAmount = computed(() => {
	if (props.transaction.type === ETransactionType.INCOME) {
		return useFormatAmount(props.transaction.amount_credit, props.transaction.account_to_info?.currency as ECurrency)
	}

	if (props.transaction.type === ETransactionType.EXPENSE || props.transaction.type === ETransactionType.LEGACY) {
		return useFormatAmount(props.transaction.amount_debit, props.transaction.account_from_info?.currency as ECurrency)
	}

	if (props.transaction.type === ETransactionType.TRANSFER) {
		return `${useFormatAmount(
			props.transaction.amount_debit,
			props.transaction.account_from_info?.currency as ECurrency,
		)} → ${useFormatAmount(props.transaction.amount_credit, props.transaction.account_to_info?.currency as ECurrency)}`
	}

	if (props.transaction.type === ETransactionType.ADJUST) {
		return useFormatAmount(props.transaction.amount_credit, props.transaction.account_to_info?.currency as ECurrency)
	}

	return '-'
})

const getTypeTag = computed(() => {
	if (props.transaction.type === ETransactionType.INCOME) {
		return {
			name: 'Income',
			color: 'green',
		}
	}

	if (props.transaction.type === ETransactionType.EXPENSE) {
		return {
			name: 'Expense',
			color: 'red',
		}
	}

	if (props.transaction.type === ETransactionType.TRANSFER) {
		return {
			name: 'Transfer',
			color: 'blue',
		}
	}

	if (props.transaction.type === ETransactionType.ADJUST) {
		return {
			name: 'Adjust',
			color: 'orange',
		}
	}

	if (props.transaction.type === ETransactionType.LEGACY) {
		return {
			name: 'Legacy',
			color: 'gray',
		}
	}

	return null
})

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
const handleDelete = () => {
	emit('delete', props.transaction.id)
}

const updateData = () => {
	emit('sent')
}
</script>

<template>
	<div class="rounded-md border px-4 py-3 font-mono text-sm flex justify-between items-center mt-2">
		<div class="left">
			<div class="top flex justify-start items-center gap-2">
				<Tag>{{ dayjs(transaction.date).format('DD MMM') }}</Tag>
				<Tag v-if="getTypeTag" :color="getTypeTag.color">{{ getTypeTag.name }}</Tag>
			</div>

			<div class="info">
				<div class="account flex items-center gap-1 mt-1 ml-2.5">
					<CornerDownRight :size="14" />
					<span>{{ getFormattedAccount }}</span>
				</div>
				<div
					v-if="props.transaction.description"
					class="mt-2 text-sm text-muted-foreground italic"
					v-html="getFormatedDescription(props.transaction.description)"
				></div>
			</div>
		</div>

		<div class="right flex items-center justify-end gap-2">
			<div class="amount">{{ getFormattedAmount }}</div>

			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button variant="ghost" size="icon" class="cursor-pointer"><EllipsisVertical /></Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem @click="handleOpenPlanPopover">Edit</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem class="text-red-500" @click="handleDelete">Delete</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Popover :open="openEdit" @update:open="handleIpdatePlanPopover">
				<PopoverTrigger as-child> <div></div></PopoverTrigger>
				<PopoverContent class="w-140">
					<FormsTransaction :transaction :accountList :tagsList :numericSpaceId @sent="updateData" />
				</PopoverContent>
			</Popover>
		</div>
	</div>
</template>
