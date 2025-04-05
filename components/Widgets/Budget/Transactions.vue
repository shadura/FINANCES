<script setup lang="ts">
import type { Account, Tag } from '~/types/index.types'

const props = defineProps<{
	accountList: Account[]
	tagsList: Tag[]
	numericSpaceId: number
	period: string
}>()

const emit = defineEmits(['sent:transaction', 'delete:transaction'])

const { list: transactionsList, getList: getTransactions } = useTransactions()

onMounted(() => {
	getTransactions(props.period)
})
</script>

<template>
	<div>
		<WidgetsTransaction
			v-for="transaction in transactionsList"
			:key="transaction.id"
			:transaction="transaction"
			:tagsList="props.tagsList"
			:accountList="props.accountList"
			:numericSpaceId="props.numericSpaceId"
			@sent="emit('sent:transaction')"
			@delete="(id: number) => emit('delete:transaction', id)"
			class="mb-2"
		/>
	</div>
</template>
