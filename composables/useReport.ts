import { PRIMARY_CURRENCY } from '~/const/currency.const'
import type { DB } from '@/types/index.types'
import type { ECurrency } from '@/types/enums/currency'

type TransactionReportItem = DB<'transactions'> & {
	transaction_tags: { id: number; tags: { id: number; name: string; color: string } }[]
	account_from_info: DB<'accounts'> | null
	account_to_info: DB<'accounts'> | null
}

const useReport = () => {
	const supabase = useSupabase()

	const numericSpaceId = computed(() => Number(useRoute().params.space))

	const isReportLoading = useState('report-loading', () => false)
	const getTransactionsReport = async (fromDate: string, toDate: string, tags?: number[]) => {
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
			.eq('type', 'expense')
			.gte('date', fromDate)
			.lte('date', toDate)

		if (error) {
			console.error(error)
			throw error
		}

		const typedData = data as unknown as TransactionReportItem[]

		const filteredList = tags?.length
			? typedData.filter((transaction) => {
					const transactionTagIds = transaction.transaction_tags.map((tt) => tt.tags.id)
					return tags.every((tagId) => transactionTagIds.includes(tagId))
			  })
			: typedData

		const { convert } = useCurrency()
		const sum = filteredList.reduce((acc, item) => {
			if (item.type !== 'expense' || !item.account_from_info?.currency) return acc

			const amount = convert(item.amount_debit || 0, item.account_from_info.currency as ECurrency, PRIMARY_CURRENCY)

			return acc + amount
		}, 0)

		return { list: filteredList, sum }
	}

	return {
		numericSpaceId,
		isReportLoading,
		getTransactionsReport,
	}
}

export default useReport
