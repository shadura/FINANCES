<script setup lang="ts">
import type { Account } from '~/types/index.types'
import { accountTypeArray } from '@/types/enums/account'
import { currencyArray } from '@/types/enums/currency'

const props = defineProps<{
	numericSpaceId: number
	account?: Account
}>()

const emit = defineEmits(['sent'])

const supabase = useSupabase()

const editItem = ref({
	name: '',
	currency: '',
	type: '',
})

const isDisabled = computed(() => !editItem.value.name || !editItem.value.currency || !editItem.value.type)

const setAccountData = () => {
	if (props.account) {
		editItem.value = {
			name: props.account.name,
			currency: props.account.currency,
			type: props.account.type,
		}
	}
}

onMounted(() => {
	if (props.account) {
		setAccountData()
	}
})

// * Form
const createAccount = async () => {
	if (isDisabled.value) return

	await supabase.from('accounts').insert({ ...editItem.value, space_id: props.numericSpaceId })

	editItem.value = {
		name: '',
		currency: '',
		type: '',
	}
}

const editAccount = async (id: number) => {
	if (isDisabled.value) return

	await supabase
		.from('accounts')
		.update({ ...editItem.value })
		.eq('id', id)
}

const handleSubmitForm = async () => {
	if (props.account) {
		await editAccount(props.account.id)
	} else {
		await createAccount()
	}

	emit('sent')
}
</script>

<template>
	<form @submit.prevent="handleSubmitForm">
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
</template>
