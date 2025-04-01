<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next'

const numericSpaceId = Number(useRoute().params.space)

const supabase = useSupabase()

const { isListLoading, list: accountsList, updateData } = useAccounts()

const deleteAccount = async (id: number) => {
	if (!confirm('Are you sure you want to delete this account?')) return

	await supabase.from('accounts').update({ deleted: true }).eq('id', id)

	await updateData()
}

onMounted(() => {
	updateData()
})
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>Accounts list</CardTitle>
			<CardDescription>Manage your accounts here.</CardDescription>
		</CardHeader>
		<CardContent>
			<Popover>
				<PopoverTrigger as-child>
					<Button>Add account</Button>
				</PopoverTrigger>
				<PopoverContent class="w-80">
					<FormsAccount :numericSpaceId @sent="updateData" />
				</PopoverContent>
			</Popover>

			<div v-if="isListLoading">
				<Loader />
			</div>

			<Table v-else class="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead> Name </TableHead>
						<TableHead>Currency</TableHead>
						<TableHead>Type</TableHead>
						<TableHead class="text-right w-[100px]"> Actions </TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow v-for="account in accountsList" :key="account.id">
						<TableCell class="font-medium">
							{{ account.name }}
						</TableCell>
						<TableCell>{{ account.currency }}</TableCell>
						<TableCell>{{ account.type }}</TableCell>
						<TableCell class="text-right">
							<div class="flex gap-1 justify-end">
								<Popover>
									<PopoverTrigger as-child>
										<Button variant="ghost" size="icon">
											<Edit />
										</Button>
									</PopoverTrigger>
									<PopoverContent class="w-80">
										<FormsAccount :numericSpaceId :account @sent="updateData" />
									</PopoverContent>
								</Popover>

								<Button variant="ghost" size="icon" @click="deleteAccount(account.id)">
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
