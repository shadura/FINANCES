import dayjs from 'dayjs'

interface IPeriod {
	value: string
	name: string
}

export default (valueFormat: string = 'YYYY-MM-DD'): IPeriod[] => {
	const now = dayjs()
	const result = []

	for (let i = 0; i < 3; i++) {
		result.push({
			value: now.subtract(3 - i, 'month').format(valueFormat),
			name: `${now.subtract(3 - i, 'month').format('MMM YYYY')}${i === 2 ? ' - Prev month' : ''}`,
		})
	}

	result.push({
		value: now.format(valueFormat),
		name: `${now.format('MMM YYYY')} - Current month`,
	})

	for (let i = 1; i < 7; i++) {
		result.push({
			value: now.add(i, 'month').format(valueFormat),
			name: `${now.add(i, 'month').format('MMM YYYY')}${i === 1 ? ' - Next month' : ''}`,
		})
	}

	console.log('result', result)

	return result
}
