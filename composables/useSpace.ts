import type { DB } from '@/types/index.types'

type Space = DB<'spaces'>
type SpaceUser = DB<'spaces_users'>

const useSpace = () => {
	const supabase = useSupabase()

	const getList = async (): Promise<Space[]> => {
		const { data, error } = await supabase.from('spaces').select('*')
		if (error) throw error
		return data
	}

	const getSpace = async (spaceId: number): Promise<Space> => {
		const { data: space, error: spaceError } = await supabase.rpc('get_space_with_members', { input_space_id: spaceId })

		if (spaceError) throw spaceError

		return space?.[0] || null
	}

	return {
		getList,
		getSpace,
	}
}

export default useSpace
