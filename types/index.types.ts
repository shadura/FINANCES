import type { Database } from './database.types'

export type DB<Table extends keyof Database['public']['Tables']> = Database['public']['Tables'][Table]['Row']
