import type { Database } from './database.types'

export type DB<Table extends keyof Database['public']['Tables']> = Database['public']['Tables'][Table]['Row']

export type Transaction = DB<'transactions'>
export type Account = DB<'accounts'>
export type Tag = DB<'tags'>
export type TransactionTags = DB<'transaction_tags'>
export type Plan = DB<'plans'>
export type PlanTags = DB<'plan_tags'>

export type TransactionWithTags = Transaction & {
	transaction_tags: { tag_id: number; tags: Tag }[]
	account_from_info?: Account
	account_to_info?: Account
}
export type PlanWithTags = Plan & { plan_tags: { tag_id: number; tags: Tag }[] }
