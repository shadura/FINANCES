<script setup lang="ts">
import type { Account, Tag, Transaction, TransactionWithTags } from '~/types/index.types'
import { useFilter } from 'reka-ui'
import { ETransactionType, transactionTypeArray } from '@/types/enums/transaction'
import { Loader2 } from 'lucide-vue-next'
import { type DateValue, now, getLocalTimeZone, parseZonedDateTime } from '@internationalized/date'

const props = defineProps<{
	numericSpaceId: number
	accountList: null | Account[]
	tagsList: null | Tag[]
	transaction?: TransactionWithTags
}>()

const emit = defineEmits(['sent'])

interface TransactionForm
	extends Omit<Partial<Transaction>, 'date' | 'amount_debit' | 'amount_credit' | 'description' | 'type'> {
	date: DateValue
	amount_debit: number
	amount_credit: number
	description: string
	type: ETransactionType
}

const clearTransaction: TransactionForm = {
	type: ETransactionType.EXPENSE,
	account_from: null,
	account_to: null,
	amount_debit: 0,
	amount_credit: 0,
	description: '',
	date: now(getLocalTimeZone()),
}

const supabase = useSupabase()

const editItem = ref<TransactionForm>({ ...clearTransaction })

const isDisabled = computed(
	() =>
		!editItem.value.type ||
		(!editItem.value.account_from && !editItem.value.account_to) ||
		(!editItem.value.amount_debit && !editItem.value.amount_credit) ||
		!editItem.value.date,
)

const getAccountFromCurrency = computed(() => {
	if (!editItem.value.account_from) return '-'
	const account = props.accountList?.find((account) => account.id === editItem.value.account_from)
	return account?.currency || '-'
})

const getAccountToCurrency = computed(() => {
	if (!editItem.value.account_to) return '-'
	const account = props.accountList?.find((account) => account.id === editItem.value.account_to)
	return account?.currency || '-'
})

const isShowFrom = computed(() => [ETransactionType.EXPENSE, ETransactionType.TRANSFER].includes(editItem.value.type))
const isShowTo = computed(() =>
	[ETransactionType.INCOME, ETransactionType.TRANSFER, ETransactionType.ADJUST].includes(editItem.value.type),
)

const isShowTags = computed(() => {
	return ![ETransactionType.ADJUST].includes(editItem.value.type)
})

const handleUpdateType = () => {
	if (!isShowFrom.value) {
		editItem.value.account_from = null
		editItem.value.amount_debit = 0
	}

	if (!isShowTo.value) {
		editItem.value.account_to = null
		editItem.value.amount_credit = 0
	}
}

const handleUpdateAccountFrom = () => {}

const handleUpdateAccountTo = () => {
	// ? Set account balance to amount input
	if (editItem.value.type === ETransactionType.ADJUST) {
		const account = props.accountList?.find((account) => account.id === editItem.value.account_to)
		if (!account) return

		editItem.value.amount_credit = account.balance || 0
	}
}

// * Tags
interface ITag {
	id: number
	name: string
	existed?: boolean
}

const tags = computed(() => {
	return props.tagsList?.map((tag) => ({ id: tag.id, name: tag.name })) || []
})

const selectedTags = ref<ITag[]>([])
const open = ref(false)
const searchTerm = ref('')

const { contains } = useFilter({ sensitivity: 'base' })
const filteredTags = computed(() => {
	const options = tags.value.filter((i) => {
		return !selectedTags.value.find((tag) => tag.id === i.id)
	})
	return searchTerm.value ? options.filter((option) => contains(option.name, searchTerm.value)) : options
})

const handleSelectTag = (ev: any) => {
	console.log('handleSelectTag', ev)
	if (typeof ev.detail.value) {
		searchTerm.value = ''
		selectedTags.value.push(ev.detail.value)
	}

	if (filteredTags.value.length === 0) {
		open.value = false
	}
}

const tagsToBeRemoved = ref<ITag[]>([])
const handleRemoveTag = (tag: ITag) => {
	if (tag.existed) tagsToBeRemoved.value.push(tag)
}

const handleAddTag = (ev: any) => {
	console.log('handleAddTag', ev)
}

// TODO: Remove tag api
const deleteTagsRelationship = async (transaction_id: number, tags: ITag[]) => {
	const { error } = await supabase
		.from('transaction_tags')
		.delete()
		.match({
			transaction_id,
			tag_id: tags.map((t) => t.id),
		})

	if (error) {
		console.error('Failed to remove tag', error)
		// maybe show a toast or undo button
	}
}

const createTagsRelationship = async (transaction_id: number, tags: ITag[]) => {
	const filteredTags = tags.reduce((acc, item) => {
		if (acc.some((i) => i.id === item.id)) return acc
		if (item.existed) return acc

		return [...acc, item]
	}, [] as ITag[])

	const transactionTags = filteredTags.map((t) => ({
		transaction_id,
		tag_id: t.id,
		space_id: props.numericSpaceId,
	}))

	await supabase.from('transaction_tags').insert(transactionTags)
}

// * Form
const isLoading = ref(false)

const formatForm = (form: TransactionForm) => {
	return {
		...form,
		space_id: props.numericSpaceId,
		date: form.date.toDate(getLocalTimeZone()),
	}
}

const createTransaction = async () => {
	if (isDisabled.value) return

	try {
		isLoading.value = true

		const formated = formatForm(editItem.value)

		const { data } = await supabase.from('transactions').insert(formated).select('id').single()

		const transaction_id = data?.id
		if (transaction_id && selectedTags.value.length) {
			createTagsRelationship(transaction_id, selectedTags.value)
		}

		editItem.value = { ...clearTransaction }
		selectedTags.value = []
	} catch (err) {
		console.error('error:', err)
	} finally {
		isLoading.value = false
	}
}

// * Edit

const setTransactionData = () => {
	if (props.transaction) {
		const iso = new Date(props.transaction.date).toISOString()
		const fixed = iso.replace('Z', `[${getLocalTimeZone()}]`)
		const zoned = parseZonedDateTime(fixed)

		editItem.value = {
			type: (props.transaction.type || ETransactionType.EXPENSE) as ETransactionType,
			account_from: props.transaction.account_from || null,
			account_to: props.transaction.account_to || null,
			amount_debit: props.transaction.amount_debit || 0,
			amount_credit: props.transaction.amount_credit || 0,
			description: props.transaction.description || '',
			date: zoned,
		}

		if (props.transaction?.transaction_tags?.length) {
			selectedTags.value = props.transaction.transaction_tags.map((tr) => ({
				id: tr.tags.id,
				name: tr.tags.name,
				existed: true,
			}))
		}
	}
}

onMounted(() => {
	if (props.transaction) {
		setTransactionData()
	}
})
const editTransaction = async (id: number) => {
	if (isDisabled.value) return

	try {
		isLoading.value = true

		await supabase.from('transactions').update(formatForm(editItem.value)).eq('id', id)

		if (props.transaction?.id && selectedTags.value.length) {
			createTagsRelationship(props.transaction.id, selectedTags.value)
		}

		if (props.transaction?.id && tagsToBeRemoved.value.length) {
			await deleteTagsRelationship(props.transaction.id, tagsToBeRemoved.value)
		}
	} catch (err) {
		console.error('error:', err)
	} finally {
		isLoading.value = false
	}
}

// * Submit
const handleSubmitForm = async () => {
	if (props.transaction) {
		await editTransaction(props.transaction.id)
	} else {
		await createTransaction()
	}

	emit('sent')
}
</script>

<template>
	<form class="grid grid-cols-2 gap-2" style="grid-template-columns: 1fr 250px" @submit.prevent="handleSubmitForm">
		<div>
			<div class="mb-4">
				<h4 class="font-medium leading-none">Create new transaction</h4>
				<p class="text-sm text-muted-foreground">Fill the form below to create a new transaction.</p>
			</div>
			<div>
				<div class="mb-2">
					<Select v-model="editItem.type" @update:model-value="handleUpdateType">
						<SelectTrigger>
							<SelectValue placeholder="Type" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem v-for="type in transactionTypeArray" :value="type" :key="type">
									{{ type }}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div v-if="isShowFrom" class="mb-2">
					<Separator class="my-4" label="Sent" />
					<Select v-model="editItem.account_from" @update:model-value="handleUpdateAccountFrom">
						<SelectTrigger class="col-span-2">
							<SelectValue placeholder="Account" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup v-if="accountList">
								<SelectItem v-for="account in accountList" :value="account.id" :key="account.id">
									{{ account.name }}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>

					<div class="relative mt-2">
						<Input v-model="editItem.amount_debit" class="pr-10" type="number" placeholder="Amount" />

						<div class="absolute top-0 right-0 text-sm h-full flex items-center px-2 text-muted-foreground">
							<span>{{ getAccountFromCurrency }}</span>
						</div>
					</div>
				</div>

				<div v-if="isShowTo" class="mb-2">
					<Separator class="my-4" :label="editItem.type === ETransactionType.ADJUST ? 'Adjust balance' : 'Received'" />

					<Select v-model="editItem.account_to" @update:model-value="handleUpdateAccountTo">
						<SelectTrigger class="col-span-2">
							<SelectValue placeholder="Account" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectItem v-for="account in accountList" :value="account.id" :key="account.id">
									{{ account.name }}
								</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>

					<div class="relative mt-2">
						<Input v-model="editItem.amount_credit" class="pr-10" type="number" placeholder="Amount" />

						<div class="absolute top-0 right-0 text-sm h-full flex items-center px-2 text-muted-foreground">
							<span>{{ getAccountToCurrency }}</span>
						</div>
					</div>
				</div>

				<Separator class="my-4" />

				<div v-if="isShowTags" class="mb-2">
					<Combobox v-model:open="open" :ignore-filter="true">
						<ComboboxAnchor as-child>
							<TagsInput
								v-model="selectedTags"
								:display-value="(tag: any) => tag.name"
								:key-value="(tag: any) => tag.id"
								class="px-2 gap-2 w-80"
								@remove-tag="handleRemoveTag"
								@add-tag="handleAddTag"
							>
								<div class="flex gap-2 flex-wrap items-center">
									<TagsInputItem v-for="item in selectedTags" :key="item.id" :value="item">
										<TagsInputItemText />
										<TagsInputItemDelete />
									</TagsInputItem>
								</div>

								<ComboboxInput v-model="searchTerm" as-child>
									<TagsInputInput
										placeholder="Tags"
										class="w-full p-0 border-none focus-visible:ring-0 h-auto"
										@keydown.enter.prevent
									/>
								</ComboboxInput>
							</TagsInput>

							<ComboboxList class="w-[--reka-popper-anchor-width]">
								<ComboboxEmpty />
								<ComboboxGroup>
									<ComboboxItem
										v-for="tag in filteredTags"
										:key="tag.id"
										:value="tag"
										@select.prevent="handleSelectTag"
									>
										{{ tag.name }}
									</ComboboxItem>
								</ComboboxGroup>
							</ComboboxList>
						</ComboboxAnchor>
					</Combobox>
				</div>

				<div class="mb-2">
					<Input v-model="editItem.description" type="text" placeholder="Description" />
				</div>

				<Button type="submit" class="col-span-2 h-8 w-full" :disabled="isDisabled || isLoading">
					<Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
					Save
				</Button>
			</div>
		</div>

		<div>
			<Calendar v-model="editItem.date" initial-focus />
		</div>
	</form>
</template>
