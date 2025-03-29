import type { Tag, TransactionWithTags } from '@/types/index.types'

const useTransactions = () => {
	const supabase = useSupabase()

	const numericSpaceId = computed(() => Number(useRoute().params.space))
	const list = useState<TransactionWithTags[]>('transactions-list', () => [])

	const isListLoading = useState('transactions-loading', () => false)
	const getList = async () => {
		try {
			isListLoading.value = true
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
			),
      account_from_info: account_from (
      id,
      name,
      balance,
      type,
      currency
    ),
      account_to_info: account_to (
      id,
      name,
      balance,
      type,
      currency
    )
		`,
				)
				.eq('space_id', numericSpaceId.value)
				.order('created_at', { ascending: false })
				.limit(200)

			if (error) throw error
			list.value = data as unknown as TransactionWithTags[]
		} catch (err) {
			console.error('error:', err)
		} finally {
			isListLoading.value = false
		}
	}

	const updateData = async () => {
		await getList()
	}

	return {
		getList,
		isListLoading,
		list,
		updateData,
	}
}

export default useTransactions
