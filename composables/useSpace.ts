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

	const getSpace = async (spaceId: number): Promise<{ space: Space; members: SpaceUser[] }> => {
		const { data: space, error: spaceError } = await supabase.from('spaces').select('*').eq('id', spaceId).single()
		const { data: members, error: membersError } = await supabase
			.from('spaces_users')
			.select('*')
			.eq('space_id', spaceId)

		if (spaceError) throw spaceError
		if (membersError) throw membersError

		return { space, members }
	}

	return {
		getList,
		getSpace,
	}
}

export default useSpace
