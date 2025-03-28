<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next'
import type { Tag } from '~/types/index.types'

const props = defineProps<{
	numericSpaceId: number
	tag?: Tag
}>()

const emit = defineEmits(['sent'])

const editItem = ref({
	name: '',
})

const isDisabled = computed(() => !editItem.value.name)

const supabase = useSupabase()

const setTagData = () => {
	if (props.tag) {
		editItem.value = {
			name: props.tag.name,
		}
	}
}

onMounted(() => {
	if (props.tag) {
		setTagData()
	}
})

const createTag = async () => {
	if (isDisabled.value) return

	await supabase.from('tags').insert({ ...editItem.value, space_id: props.numericSpaceId })

	editItem.value = {
		name: '',
	}
}

const editTag = async (id: number) => {
	if (isDisabled.value) return

	await supabase
		.from('tags')
		.update({ ...editItem.value })
		.eq('id', id)
}

const handleSubmitForm = async () => {
	if (props.tag) {
		await editTag(props.tag.id)
	} else {
		await createTag()
	}

	emit('sent')
}
</script>

<template>
	<form @submit.prevent="handleSubmitForm">
		<div>
			<div class="mb-4">
				<h4 class="font-medium leading-none">Create new tag</h4>
				<p class="text-sm text-muted-foreground">Fill the form below to create a new tag.</p>
			</div>
			<div>
				<div class="mb-2">
					<Input id="name" type="text" v-model="editItem.name" class="col-span-2 h-8" placeholder="Name" />
				</div>
				<Button type="submit" class="col-span-2 h-8 w-full" :disabled="isDisabled">Save</Button>
			</div>
		</div>
	</form>
</template>
