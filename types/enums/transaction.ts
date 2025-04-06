export enum ETransactionType {
	INCOME = 'income',
	EXPENSE = 'expense',
	TRANSFER = 'transfer',
	ADJUST = 'adjust',
	LEGACY = 'legacy',
}

export const transactionTypeArray: string[] = Object.values(ETransactionType)
