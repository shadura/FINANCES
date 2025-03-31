import type { Account } from '@/types/index.types'
import { PRIMARY_CURRENCY, SECONDARY_CURRENCY } from '@/const/currency.const'
import type { ECurrency } from '@/types/enums/currency'

const useAccounts = () => {
	const supabase = useSupabase()

	const list = useState<Account[]>('accounts-list', () => [])

	const numericSpaceId = computed(() => Number(useRoute().params.space))

	const isListLoading = useState('accounts-loading', () => false)
	const getList = async () => {
		isListLoading.value = true

		try {
			const { data, error } = await supabase
				.from('accounts')
				.select('*')
				.eq('space_id', numericSpaceId.value)
				.eq('deleted', false)
				.order('created_at', { ascending: false })
			if (error) throw error

			list.value = data as unknown as Account[]
		} catch (err) {
			console.error('error:', err)
		} finally {
			isListLoading.value = false
		}
	}

	const updateData = async () => {
		await getList()
	}

	const getNetWorhInfo = computed(() => {
		if (!list.value.length)
			return {
				amount: {
					primary: {
						value: 0,
						currency: PRIMARY_CURRENCY,
					},
					secondary: {
						value: 0,
						currency: SECONDARY_CURRENCY,
					},
				},
				byAccount: [],
				byType: [],
				byCurrency: [],
			}

		const { convert } = useCurrency()

		const byAccount = list.value
			.filter((account) => account.is_net_worth)
			.map((account) => {
				return {
					name: account.name,
					amount: {
						primary: {
							value: convert(account.balance || 0, account.currency as ECurrency, PRIMARY_CURRENCY),
							currency: PRIMARY_CURRENCY,
						},
					},
				}
			})

		const sum = byAccount.reduce((acc, account) => acc + account.amount.primary.value, 0)

		const byType = list.value
			.filter((account) => account.is_net_worth)
			.reduce((acc: any[], account) => {
				const item = acc.find((a) => a.name === account.type)

				if (item) {
					item.amount.primary = {
						value:
							item.amount.primary.value +
							convert(account.balance || 0, account.currency as ECurrency, PRIMARY_CURRENCY),
						currency: PRIMARY_CURRENCY,
					}

					return acc
				}

				return [
					...acc,
					{
						name: account.type,
						amount: {
							primary: {
								value: convert(account.balance || 0, account.currency as ECurrency, PRIMARY_CURRENCY),
								currency: PRIMARY_CURRENCY,
							},
						},
					},
				]
			}, [])

		const byCurrency = list.value
			.filter((account) => account.is_net_worth)
			.reduce((acc: any[], account) => {
				const item = acc.find((a) => a.name === account.currency)

				if (item) {
					item.amount.primary = {
						value:
							item.amount.primary.value +
							convert(account.balance || 0, account.currency as ECurrency, PRIMARY_CURRENCY),
						currency: PRIMARY_CURRENCY,
					}

					return acc
				}

				return [
					...acc,
					{
						name: account.currency,
						amount: {
							primary: {
								value: convert(account.balance || 0, account.currency as ECurrency, PRIMARY_CURRENCY),
								currency: PRIMARY_CURRENCY,
							},
						},
					},
				]
			}, [])

		return {
			amount: {
				primary: {
					value: sum,
					currency: PRIMARY_CURRENCY,
				},
				secondary: {
					value: convert(sum, PRIMARY_CURRENCY, SECONDARY_CURRENCY),
					currency: SECONDARY_CURRENCY,
				},
			},
			byAccount,
			byType,
			byCurrency,
		}
	})

	return {
		getList,
		list,
		updateData,
		isListLoading,
		getNetWorhInfo,
	}
}

export default useAccounts
