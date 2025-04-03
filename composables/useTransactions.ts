import type { Tag, TransactionWithTags } from '@/types/index.types'
import dayjs from 'dayjs'
import { PRIMARY_CURRENCY, SECONDARY_CURRENCY } from '~/const/currency.const'
import type { ECurrency } from '~/types/enums/currency'
import { ETransactionType } from '~/types/enums/transaction'

const useTransactions = () => {
	const supabase = useSupabase()

	const numericSpaceId = computed(() => Number(useRoute().params.space))

	const list = useState<TransactionWithTags[]>('transactions-list', () => [])

	const isListLoading = useState('transactions-loading', () => false)
	const getList = async (period: string) => {
		try {
			isListLoading.value = true

			const date_from = dayjs(period, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD')
			const date_to = dayjs(period, 'YYYY-MM-DD').endOf('month').add(1, 'day').format('YYYY-MM-DD')

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

	const getSum = computed(() => {
		const { convert } = useCurrency()

		if (!list.value)
			return {
				primary: {
					value: 0,
					currency: PRIMARY_CURRENCY,
				},
				secondary: {
					value: 0,
					currency: SECONDARY_CURRENCY,
				},
			}

		const primary = list.value.reduce((acc, transaction) => {
			if (
				transaction.amount_debit !== null &&
				transaction.account_from_info?.currency &&
				transaction.type !== ETransactionType.TRANSFER
			) {
				return (
					acc + convert(transaction.amount_debit, transaction.account_from_info.currency as ECurrency, PRIMARY_CURRENCY)
				)
			}

			return acc
		}, 0)

		const secondary = convert(primary, PRIMARY_CURRENCY, SECONDARY_CURRENCY)

		return {
			primary: {
				value: primary,
				currency: PRIMARY_CURRENCY,
			},
			secondary: {
				value: secondary,
				currency: SECONDARY_CURRENCY,
			},
		}
	})

	const getTransactionsByPlanId = (planId: number) =>
		computed(() => {
			return list.value.filter((transaction) => {
				if (planId === 0) {
					return !transaction.plan_id
				}
				return transaction.plan_id === planId
			})
		})

	const deleteTransaction = async (id: number) => {
		if (!confirm('Are you sure you want to delete this transaction?')) return

		await supabase.from('transactions').delete().eq('id', id)

		list.value = list.value.filter((transaction) => transaction.id !== id)
	}

	return {
		getList,
		isListLoading,
		list,
		getSum,
		getTransactionsByPlanId,
		deleteTransaction,
	}
}

export default useTransactions
