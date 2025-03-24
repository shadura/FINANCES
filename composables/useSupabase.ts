import type { Database } from '@/types/supabase'

const useSupabase = () => {
	const supabase = useSupabaseClient<Database>()
	return supabase
}

export default useSupabase
