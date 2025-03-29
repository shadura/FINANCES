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
				list: [],
			}

		const { convert } = useCurrency()

		const accountsList = list.value
			.filter((account) => account.is_net_worth)
			.map((account) => {
				return {
					amount: account.balance,
					currency: account.currency as ECurrency,
					name: account.name,
					converted: {
						amount: convert(account.balance || 0, account.currency as ECurrency, PRIMARY_CURRENCY),
						currency: PRIMARY_CURRENCY,
					},
				}
			})

		const sum = accountsList.reduce((acc, account) => acc + account.converted.amount, 0)

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
			list: accountsList,
		}
	})

	const getAccountName = (id: number | null) => {
		if (!id) return ''

		const account = list.value?.find((account) => account.id === id)
		return account?.name || ''
	}

	const getAccountCurrency = (id: number | null) => {
		if (!id) return ''

		const account = list.value?.find((account) => account.id === id)
		return account?.currency || ''
	}

	return {
		getList,
		list,
		updateData,
		isListLoading,
		getNetWorhInfo,
		getAccountName,
		getAccountCurrency,
	}
}

export default useAccounts
