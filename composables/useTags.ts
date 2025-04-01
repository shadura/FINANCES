import type { Tag } from '@/types/index.types'

const useTags = () => {
	const supabase = useSupabase()

	const numericSpaceId = computed(() => Number(useRoute().params.space))
	const list = useState<Tag[]>('tags-list', () => [])

	const isListLoading = useState('tags-loading', () => false)
	const getList = async () => {
		try {
			const { data, error } = await supabase
				.from('tags')
				.select('*')
				.eq('space_id', numericSpaceId.value)
				.eq('deleted', false)
			if (error) throw error
			list.value = data
		} catch (err) {
			console.error('error:', err)
		} finally {
		}
	}

	return {
		getList,
		isListLoading,
		list,
	}
}

export default useTags
