export enum ETransactionType {
	INCOME = 'income',
	EXPENSE = 'expense',
	TRANSFER = 'transfer',
	ADJUST = 'adjust',
}

export const transactionTypeArray: string[] = Object.values(ETransactionType)
