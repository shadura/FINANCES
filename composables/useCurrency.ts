import type { ECurrency } from '@/types/enums/currency'

const useCurrency = () => {
	const currentCurrencyRates = useState('current-currency-rates', () => {
		return {
			USD: 1,
			EUR: 0.97,
			UAH: 0.024,
		}
	})

	const convert = (amount: number, from: ECurrency, to: ECurrency) => {
		if (from === to) return amount
		if (!currentCurrencyRates.value[from] || !currentCurrencyRates.value[to]) return amount

		return Math.round((amount * currentCurrencyRates.value[from]) / currentCurrencyRates.value[to])
	}

	return {
		currentCurrencyRates,
		convert,
	}
}

export default useCurrency
