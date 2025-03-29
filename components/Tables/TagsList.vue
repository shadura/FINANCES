<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next'
import { PRIMARY_CURRENCY } from '~/const/currency.const'

const numericSpaceId = Number(useRoute().params.space)

const supabase = useSupabase()

const { isListLoading, list: tagsList, updateData } = useTags()

const deleteTag = async (id: number) => {
	if (!confirm('Are you sure you want to delete this tag?')) return

	await supabase.from('tags').update({ deleted: true }).eq('id', id)
	await updateData()
}

onMounted(() => {
	updateData()
})
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
					<FormsTag :numericSpaceId @sent="updateData" />
				</PopoverContent>
			</Popover>

			<div v-if="isListLoading">
				<Loader />
			</div>

			<Table v-else class="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead> Name </TableHead>
						<TableHead class="text-right w-[100px]"> Actions </TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow v-for="tag in tagsList" :key="tag.id">
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
										<FormsTag :numericSpaceId :tag="tag" @sent="updateData" />
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
