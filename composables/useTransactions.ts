import type { Tag, TransactionWithTags } from '@/types/index.types'
import dayjs from 'dayjs'

const useTransactions = () => {
	const supabase = useSupabase()

	const numericSpaceId = computed(() => Number(useRoute().params.space))

	const period = useState('transactions-period', () => dayjs().format('YYYY-MM-DD'))

	const list = useState<TransactionWithTags[]>('transactions-list', () => [])

	const isListLoading = useState('transactions-loading', () => false)
	const getList = async () => {
		try {
			isListLoading.value = true

			const date_from = dayjs(period.value, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD')
			const date_to = dayjs(period.value, 'YYYY-MM-DD').endOf('month').add(1, 'day').format('YYYY-MM-DD')

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

			// Apply date filters if both dates are provided
			if (date_from) {
				query = query.gte('date', date_from)
			}
			if (date_to) {
				query = query.lte('date', date_to)
			}

			query = query.order('date', { ascending: false }).limit(500)

			const { data, error } = await query

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
		period,
		getList,
		isListLoading,
		list,
		updateData,
	}
}

export default useTransactions
