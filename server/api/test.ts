export default defineEventHandler(async (event) => {
	const data = await $fetch<
		{
			currencyCodeA: number
			currencyCodeB: number
			date: number
			rateBuy: number
			rateSell: number
		}[]
	>('https://api.monobank.ua/bank/currency')

	if (!data.length) return

	const eurItem = data.find((item) => item.currencyCodeA === 978 && item.currencyCodeB === 840)
	const eur = Math.round((((eurItem?.rateBuy || 0) + (eurItem?.rateSell || 0)) / 2) * 1000000) / 1000000

	const uahItem = data.find((item) => item.currencyCodeA === 840 && item.currencyCodeB === 980)
	const uah = Math.round((1 / (((uahItem?.rateBuy || 0) + (uahItem?.rateSell || 0)) / 2)) * 1000000) / 1000000

	if (!uah || !eur)
		return {
			success: false,
			data: { USD: 1, EUR: eur, UAH: uah },
		}

	return {
		success: true,
		data: { USD: 1, EUR: eur, UAH: uah },
	}
})
