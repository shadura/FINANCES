import type { ECurrency } from '~/types/enums/currency'

const useFormatAmount = (amount: number, currency?: ECurrency) => {
	const formattedNumber = (amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
	return currency ? `${formattedNumber} ${currency || ''}` : formattedNumber
}

export default useFormatAmount
