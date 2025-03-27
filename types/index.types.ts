import type { Database } from './database.types'

export type DB<Table extends keyof Database['public']['Tables']> = Database['public']['Tables'][Table]['Row']

export type Transaction = DB<'transactions'>
export type Account = DB<'accounts'>
export type Tag = DB<'tags'>
export type TransactionTags = DB<'transaction_tags'>

export type TransactionWithTags = Transaction & { transaction_tags: { tag_id: number; tags: Tag }[] }
