import { PRIMARY_CURRENCY } from '~/const/currency.const'
import type { DB, TransactionWithTags } from '@/types/index.types'
import type { ECurrency } from '@/types/enums/currency'
import dayjs from 'dayjs'

const useReport = () => {
	const supabase = useSupabase()

	const numericSpaceId = computed(() => Number(useRoute().params.space))

	const isReportLoading = useState('report-loading', () => false)
	const getTransactionsReport = async (fromDate: string, toDate: string, tags?: number[]) => {
		const adjustedToDate = dayjs(toDate).endOf('day').toISOString()

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
			.in('type', ['expense', 'legacy'])
			.gte('date', fromDate)
			.lte('date', adjustedToDate)

		if (error) {
			console.error(error)
			throw error
		}

		const typedData = data as unknown as TransactionWithTags[]

		const filteredList = tags?.length
			? typedData.filter((transaction) => {
					const transactionTagIds = transaction.transaction_tags.map((tt) => tt.tags.id)
					return tags.every((tagId) => transactionTagIds.includes(tagId))
			  })
			: typedData

		const { convert } = useCurrency()
		const sum = filteredList.reduce((acc, item) => {
			if (!['expense', 'legacy'].includes(item.type) || !item.account_from_info?.currency) return acc

			const amount = convert(item.amount_debit || 0, item.account_from_info.currency as ECurrency, PRIMARY_CURRENCY)

			return acc + amount
		}, 0)

		return { list: filteredList, sum }
	}

	const getAccountBalanceHistory = async (account: DB<'accounts'>, datePeriod: 'month' | 'quarter' | 'year') => {
		console.log('getAccountBalanceHistory', account, datePeriod)
		try {
			isReportLoading.value = true

			let dateFrom = dayjs()
			console.log('dateFrom', dateFrom)
			switch (datePeriod) {
				case 'month':
					dateFrom = dateFrom.subtract(1, 'month')
					break
				case 'quarter':
					dateFrom = dateFrom.subtract(3, 'month')
					break
				case 'year':
					dateFrom = dateFrom.subtract(1, 'year')
					break
				default:
					dateFrom = dateFrom.subtract(1, 'year')
			}

			const { data, error } = await supabase
				.from('transactions')
				.select('id, type, date, account_from, account_to, amount_credit, amount_debit')
				.eq('space_id', numericSpaceId.value)
				.or(`account_from.eq.${account.id},account_to.eq.${account.id}`)
				.gte('date', dateFrom.toISOString())
				.order('date', { ascending: false })

			if (error) throw new Error(error.message)

			let balance = account.balance || 0
			const balanceHistory: { date: string; balance: number }[] = []

			data.forEach((transaction, idx) => {
				if (idx === 0) {
					balanceHistory.push({ date: transaction.date, balance })
					return
				}

				switch (transaction.type) {
					case 'income':
						if (transaction.account_to === account.id) {
							balance -= transaction.amount_credit || 0
						}
						break
					case 'expense':
						if (transaction.account_from === account.id) {
							balance += transaction.amount_debit || 0
						}
						break
					case 'transfer':
						if (transaction.account_from === account.id) {
							balance += transaction.amount_debit || 0
						}
						if (transaction.account_to === account.id) {
							balance -= transaction.amount_credit || 0
						}
						break
					case 'adjust':
						if (transaction.account_to === account.id) {
							balance -= transaction.amount_credit || 0
						}
						break
					default:
						break
				}
				balanceHistory.push({ date: transaction.date, balance })
			})

			const combinedItemsByTheSameDate = balanceHistory.reduce((acc, item) => {
				const existingItem = acc.find((i) => i.date === item.date)
				if (existingItem) {
					existingItem.balance = item.balance
					return acc
				}
				return [...acc, item]
			}, [] as { date: string; balance: number }[])

			return combinedItemsByTheSameDate.reverse()
		} catch (error) {
			console.error('Error fetching account balance history:', error)
			return []
		} finally {
			isReportLoading.value = false
		}
	}

	return {
		numericSpaceId,
		isReportLoading,
		getTransactionsReport,
		getAccountBalanceHistory,
	}
}

export default useReport
