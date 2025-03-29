<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next'

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

const deleteTag = async (id: number) => {
	if (!confirm('Are you sure you want to delete this tag?')) return

	await supabase.from('tags').update({ deleted: true }).eq('id', id)
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
			<Popover>
				<PopoverTrigger as-child>
					<Button>Add tag</Button>
				</PopoverTrigger>
				<PopoverContent class="w-80">
					<FormsTag :numericSpaceId @sent="refresh" />
				</PopoverContent>
			</Popover>

			<Table class="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead> Name </TableHead>
						<TableHead class="text-right w-[100px]"> Actions </TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow v-for="tag in data" :key="tag.id">
						<TableCell class="font-medium">
							<Tag :color="tag.color">
								{{ tag.name }}
							</Tag>
						</TableCell>
						<TableCell class="text-right">
							<div class="flex gap-1 justify-end">
								<Popover>
									<PopoverTrigger as-child>
										<Button variant="ghost" size="icon">
											<Edit />
										</Button>
									</PopoverTrigger>
									<PopoverContent class="w-80">
										<FormsTag :numericSpaceId :tag="tag" @sent="refresh" />
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
