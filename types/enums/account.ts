export enum EAccountType {
	CASH = 'cash',
	BANK = 'bank',
	CRYPTO = 'crypto',
	STOCK = 'stock',
	REAL_ESTATE = 'real estate',
	CAR = 'car',
	OTHER = 'other',
}

export const accountTypeArray: string[] = Object.values(EAccountType)
