import dayjs from 'dayjs'
import type { Tag, PlanWithTags, Account } from '@/types/index.types'
import { ECurrency } from '@/types/enums/currency'

import { PRIMARY_CURRENCY } from '@/const/currency.const'

const usePlan = () => {
	const supabase = useSupabase()

	const numericSpaceId = computed(() => Number(useRoute().params.space))

	const period = useState('plans-period', () => dayjs().format('YYYY-MM-DD'))
	const list = useState<PlanWithTags[]>('plans-list', () => [])

	const isListLoading = useState('plans-loading', () => false)
	const getPlans = async () => {
		isListLoading.value = true

		const formatedPeriod = Number(dayjs(period.value, 'YYYY-MM-DD').format('MMYYYY'))

		try {
			const { data, error } = await supabase
				.from('plans')
				.select(
					`
        *,
        plan_tags (
          id,
          tags (
            id,
            name,
            color
          )
        ),
				preferred_account_info: preferred_account (
					id,
					name,
					balance,
					type,
					currency,
					deleted
				)
      `,
				)
				.eq('period_month_year', formatedPeriod)
				.eq('space_id', numericSpaceId.value)
				.order('created_at', { ascending: false })

			if (error) throw error

			list.value = data as unknown as PlanWithTags[]
		} catch (err) {
			console.error('error:', err)
		} finally {
			isListLoading.value = false
		}
	}

	const updateData = async () => {
		await getPlans()
	}

	const deletePlan = async (id: number) => {
		if (!confirm('Are you sure you want to delete this plan?')) return

		await supabase.from('plans').delete().eq('id', id)
		await updateData()
	}

	const getPlannedTags = computed(() => {
		if (!list.value.length)
			return {
				income: {
					amount: 0,
					list: [],
				},
				expense: {
					amount: 0,
					list: [],
				},
				byAccounts: [],
			}

		const expenceList = list.value.filter((plan) => !plan.is_income)
		const incomeList = list.value.filter((plan) => plan.is_income)

		const { convert } = useCurrency()

		const expenceAmount = expenceList.reduce(
			(acc, plan) => acc + convert(plan.amount, plan.currency as ECurrency, PRIMARY_CURRENCY),
			0,
		)

		const incomeAmount = incomeList.reduce(
			(acc, plan) => acc + convert(plan.amount, plan.currency as ECurrency, PRIMARY_CURRENCY),
			0,
		)

		const result: { tag: Tag; amount: number; currency: ECurrency; persent: number }[] = []
		expenceList.forEach((plan) => {
			if (!plan.plan_tags.length) return

			plan.plan_tags.forEach((planTag) => {
				if (!plan.currency) return

				const existedTag = result.find((tag) => tag.tag.id === planTag.tags.id)

				if (existedTag) {
					existedTag.amount += convert(plan.amount, plan.currency as ECurrency, PRIMARY_CURRENCY)
					return
				}

				result.push({
					tag: planTag.tags,
					amount: convert(plan.amount, plan.currency as ECurrency, PRIMARY_CURRENCY),
					currency: PRIMARY_CURRENCY,
					persent: 0,
				})
			})
		})

		interface IPreferredAccount {
			account: Account
			amount: number
			currency: typeof PRIMARY_CURRENCY
		}
		const preferredAccountList = expenceList.reduce((acc, item): IPreferredAccount[] => {
			if (!item.preferred_account_info) return acc

			const existedAccount = acc.find((accountItem) => accountItem.account.id === item.preferred_account_info?.id)

			if (existedAccount) {
				existedAccount.amount += convert(item.amount, item.currency as ECurrency, PRIMARY_CURRENCY)
				return acc
			}

			const newItem: IPreferredAccount = {
				account: item.preferred_account_info,
				amount: convert(item.amount, item.currency as ECurrency, PRIMARY_CURRENCY),
				currency: PRIMARY_CURRENCY,
			}

			return [...acc, newItem]
		}, [] as IPreferredAccount[])

		return {
			income: {
				amount: incomeAmount,
				list: [],
			},
			expense: {
				amount: expenceAmount,
				list: result
					.sort((a, b) => b.amount - a.amount)
					.map((tag) => ({
						...tag,
						persent: Math.round((tag.amount / expenceAmount) * 100 * 100) / 100,
					})),
			},
			byAccounts: preferredAccountList,
		}
	})

	return {
		getPlans,
		deletePlan,
		updateData,
		list,
		isListLoading,
		period,
		getPlannedTags,
	}
}

export default usePlan
