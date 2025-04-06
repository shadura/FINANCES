<script setup lang="ts">
import type { TransactionWithTags } from '~/types/index.types'

const LIMIT = 20

const supabase = useSupabase()

const numericSpaceId = computed(() => Number(useRoute().params.space))

const { list: tagsList, getList: getTags } = useTags()
const { list: accountList, getList: getAccounts } = useAccounts()

const list = ref<TransactionWithTags[]>([])

const noMoreItems = ref(false)
const isListLoading = ref(false)
const getList = async (offset: number, limit: number) => {
	try {
		isListLoading.value = true

		let query = supabase
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
					),
					account_from_info: account_from (
						id,
						name,
						balance,
						type,
						currency,
						deleted
					),
					account_to_info: account_to (
						id,
						name,
						balance,
						type,
						currency,
						deleted
					)
				`,
			)
			.eq('space_id', numericSpaceId.value)

		query = query.order('date', { ascending: false }).range(offset, offset + limit - 1)

		const { data, error } = await query

		if (error) throw error
		list.value = [...list.value, ...(data as unknown as TransactionWithTags[])]

		if (data.length < limit) {
			noMoreItems.value = true
		}
	} catch (err) {
		console.error('error:', err)
	} finally {
		isListLoading.value = false
	}
}

onMounted(() => {
	getTags()
	getAccounts()
	getList(0, LIMIT)
})

const handleEditTransaction = (id: number) => {}

const handleDeleteTransaction = (id: number) => {}
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">All transactions</h1>

		<div class="mt-6">
			<WidgetsTransaction
				v-for="transaction in list"
				:key="transaction.id"
				:transaction
				:tagsList
				:accountList
				:numericSpaceId
				showTags
				@sent="handleEditTransaction"
				@delete="handleDeleteTransaction"
			/>

			<div v-if="!noMoreItems" class="text-center mt-4">
				<Button type="button" class="col-span-2 h-8" :disabled="isListLoading" @click="getList(list.length, LIMIT)">
					<Loader2 v-if="isListLoading" class="w-4 h-4 mr-2 animate-spin" />
					Load more
				</Button>
			</div>
		</div>
	</div>
</template>
