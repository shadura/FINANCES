import type { ECurrency } from '~/types/enums/currency'

const useFormatAmount = (amount: number, currency?: ECurrency) => {
	if (!amount) return ''

	const formattedNumber = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
	return currency ? `${formattedNumber} ${currency || ''}` : formattedNumber
}

export default useFormatAmount
