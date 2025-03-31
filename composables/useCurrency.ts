import type { ECurrency } from '@/types/enums/currency'

const useCurrency = () => {
	const supabase = useSupabase()

	const currentCurrencyRates = useState('current-currency-rates', () => {
		return {
			USD: 1,
			EUR: 1.0815,
			UAH: 0.024137,
		}
	})

	const getCurrencyRates = async () => {
		try {
			const { data, error } = await supabase
				.from('currency_rates')
				.select('*')
				.order('date', { ascending: false })
				.limit(1)
				.single()
			if (error) throw error

			currentCurrencyRates.value = data
		} catch (err) {
			console.error('error:', err)
		}
	}

	const convert = (amount: number, from: ECurrency, to: ECurrency) => {
		if (from === to) return amount
		if (!currentCurrencyRates.value[from] || !currentCurrencyRates.value[to]) return amount

		return (amount * currentCurrencyRates.value[from]) / currentCurrencyRates.value[to]
	}

	return {
		getCurrencyRates,
		currentCurrencyRates,
		convert,
	}
}

export default useCurrency
