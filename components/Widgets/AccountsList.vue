<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next'
import type { DB } from '~/types/index.types'
import { accountTypeArray } from '@/types/enums/account'
import { currencyArray } from '@/types/enums/currency'

type Account = DB<'accounts'>

const editItem = ref({
	name: '',
	currency: '',
	type: '',
})

const handlePopoverForm = (val: boolean, account?: Account) => {
	if (val && account) {
		editItem.value = {
			name: account.name,
			currency: account.currency,
			type: account.type,
		}
	} else {
		editItem.value = {
			name: '',
			currency: '',
			type: '',
		}
	}
}

const isDisabled = computed(() => !editItem.value.name || !editItem.value.currency || !editItem.value.type)

const numericSpaceId = Number(useRoute().params.space)

const supabase = useSupabase()

const { data, refresh } = useAsyncData('accounts', async () => {
	const { data, error } = await supabase
		.from('accounts')
		.select('*')
		.eq('space_id', numericSpaceId)
		.eq('deleted', false)
		.order('created_at', { ascending: false })
	if (error) throw error
	return data
})

const createAccount = async () => {
	if (isDisabled.value) return

	await supabase.from('accounts').insert({ ...editItem.value, space_id: numericSpaceId })

	editItem.value = {
		name: '',
		currency: '',
		type: '',
	}

	await refresh()
}

const deleteAccount = async (id: number) => {
	if (!confirm('Are you sure you want to delete this account?')) return

	await supabase.from('accounts').update({ deleted: true }).eq('id', id)
	await refresh()
}

const editAccount = async (id: number) => {
	if (isDisabled.value) return

	await supabase
		.from('accounts')
		.update({ ...editItem.value })
		.eq('id', id)

	await refresh()
}
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>Accounts list</CardTitle>
			<CardDescription>Manage your accounts here.</CardDescription>
		</CardHeader>
		<CardContent>
			<Popover @update:open="(val) => handlePopoverForm(val)">
				<PopoverTrigger as-child>
					<Button>Add account</Button>
				</PopoverTrigger>
				<PopoverContent class="w-80">
					<form @submit.prevent="createAccount">
						<div>
							<div class="mb-4">
								<h4 class="font-medium leading-none">Create new account</h4>
								<p class="text-sm text-muted-foreground">Fill the form below to create a new account.</p>
							</div>
							<div>
								<div class="mb-2">
									<Input id="name" type="text" v-model="editItem.name" class="col-span-2 h-8" placeholder="Name" />
								</div>
								<div class="mb-2">
									<Select v-model="editItem.currency">
										<SelectTrigger>
											<SelectValue placeholder="Currency" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem v-for="currency in currencyArray" :value="currency" :key="currency">
													{{ currency }}
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</div>
								<div class="mb-4">
									<Select v-model="editItem.type">
										<SelectTrigger>
											<SelectValue placeholder="Type" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem v-for="type in accountTypeArray" :value="type" :key="type">
													{{ type }}
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
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
						<TableHead>Currency</TableHead>
						<TableHead>Type</TableHead>
						<TableHead class="text-right w-[100px]"> Actions </TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow v-for="account in data" :key="account.id">
						<TableCell class="font-medium">
							{{ account.name }}
						</TableCell>
						<TableCell>{{ account.currency }}</TableCell>
						<TableCell>{{ account.type }}</TableCell>
						<TableCell class="text-right">
							<div class="flex gap-1 justify-end">
								<Popover @update:open="(val) => handlePopoverForm(val, account)">
									<PopoverTrigger as-child>
										<Button variant="ghost" size="icon">
											<Edit />
										</Button>
									</PopoverTrigger>
									<PopoverContent class="w-80">
										<form @submit.prevent="editAccount(account.id)">
											<div>
												<div class="mb-4">
													<h4 class="font-medium leading-none">Edit account</h4>
													<p class="text-sm text-muted-foreground">Fill the form below to edit the account.</p>
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
													<div class="mb-2">
														<Select v-model="editItem.currency" disabled>
															<SelectTrigger>
																<SelectValue placeholder="Currency" />
															</SelectTrigger>
															<SelectContent>
																<SelectGroup>
																	<SelectItem v-for="currency in currencyArray" :value="currency" :key="currency">
																		{{ currency }}
																	</SelectItem>
																</SelectGroup>
															</SelectContent>
														</Select>
													</div>
													<div class="mb-4">
														<Select v-model="editItem.type">
															<SelectTrigger>
																<SelectValue placeholder="Type" />
															</SelectTrigger>
															<SelectContent>
																<SelectGroup>
																	<SelectItem v-for="type in accountTypeArray" :value="type" :key="type">
																		{{ type }}
																	</SelectItem>
																</SelectGroup>
															</SelectContent>
														</Select>
													</div>
													<Button type="submit" class="col-span-2 h-8 w-full" :disabled="isDisabled">Save</Button>
												</div>
											</div>
										</form>
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
