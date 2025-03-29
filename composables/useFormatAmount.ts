import type { ECurrency } from '~/types/enums/currency'

const useFormatAmount = (amount: number | null, currency?: ECurrency) => {
	const amountWithoutDecimal = Math.round(amount || 0)
	const formattedNumber = amountWithoutDecimal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
	return currency ? `${formattedNumber} ${currency || ''}` : formattedNumber
}

export default useFormatAmount
