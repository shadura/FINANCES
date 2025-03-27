<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next'
import type { DB } from '~/types/index.types'

type Tag = DB<'tags'>

const editItem = ref({
	name: '',
})

const handlePopoverForm = (val: boolean, tag?: Tag) => {
	if (val && tag) {
		editItem.value = {
			name: tag.name,
		}
	} else {
		editItem.value = {
			name: '',
		}
	}
}

const isDisabled = computed(() => !editItem.value.name)

const numericSpaceId = Number(useRoute().params.space)

const supabase = useSupabase()

const { data, refresh } = useAsyncData('tags', async () => {
	const { data, error } = await supabase
		.from('tags')
		.select('*')
		.eq('space_id', numericSpaceId)
		.eq('deleted', false)
		.order('created_at', { ascending: false })
	if (error) throw error
	return data
})

const createTag = async () => {
	if (isDisabled.value) return

	await supabase.from('tags').insert({ ...editItem.value, space_id: numericSpaceId })

	editItem.value = {
		name: '',
	}

	await refresh()
}

const deleteTag = async (id: number) => {
	if (!confirm('Are you sure you want to delete this tag?')) return

	await supabase.from('tags').update({ deleted: true }).eq('id', id)
	await refresh()
}

const editTag = async (id: number) => {
	if (isDisabled.value) return

	await supabase
		.from('tags')
		.update({ ...editItem.value })
		.eq('id', id)

	await refresh()
}
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>Tags list</CardTitle>
			<CardDescription>Manage your tags here.</CardDescription>
		</CardHeader>
		<CardContent>
			<Popover @update:open="(val) => handlePopoverForm(val)">
				<PopoverTrigger as-child>
					<Button>Add tag</Button>
				</PopoverTrigger>
				<PopoverContent class="w-80">
					<form @submit.prevent="createTag">
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
				</PopoverContent>
			</Popover>

			<Table class="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead> Name </TableHead>
						<TableHead> Color </TableHead>
						<TableHead class="text-right w-[100px]"> Actions </TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow v-for="tag in data" :key="tag.id">
						<TableCell class="font-medium">
							{{ tag.name }}
						</TableCell>
						<TableCell>{{ tag.color }}</TableCell>
						<TableCell class="text-right">
							<div class="flex gap-1 justify-end">
								<Popover @update:open="(val) => handlePopoverForm(val, tag)">
									<PopoverTrigger as-child>
										<Button variant="ghost" size="icon">
											<Edit />
										</Button>
									</PopoverTrigger>
									<PopoverContent class="w-80">
										<form @submit.prevent="editTag(tag.id)">
											<div>
												<div class="mb-4">
													<h4 class="font-medium leading-none">Edit tag</h4>
													<p class="text-sm text-muted-foreground">Fill the form below to edit the tag.</p>
												</div>
												<div>
													<div class="mb-2">
														<Input
															id="name"
															type="text"
															v-model="editItem.name"
															class="col-span-2 h-8"
															placeholder="Name"
														/>
													</div>
													<Button type="submit" class="col-span-2 h-8 w-full" :disabled="isDisabled">Save</Button>
												</div>
											</div>
										</form>
									</PopoverContent>
								</Popover>

								<Button variant="ghost" size="icon" @click="deleteTag(tag.id)">
									<Trash color="red" />
								</Button>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</CardContent>
	</Card>
</template>
