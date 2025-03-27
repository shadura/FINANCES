import type { Database } from '@/types/database.types'

const useSupabase = () => {
	const supabase = useSupabaseClient<Database>()
	return supabase
}

export default useSupabase
