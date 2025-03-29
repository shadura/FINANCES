<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next'
import type { Plan, Tag } from '~/types/index.types'
import { useFilter } from 'reka-ui'
import { currencyArray } from '@/types/enums/currency'

const props = defineProps<{
	numericSpaceId: number
	period: number
	tagsList: null | Tag[]
	plan?: PlanWithTags
}>()

const emit = defineEmits(['sent'])

const clearPlan = {
	description: '',
	amount: 0,
	currency: '',
	is_income: false,
}

const editItem = ref({ ...clearPlan })

const isDisabled = computed(() => !editItem.value.amount || !editItem.value.currency || !selectedTags.value.length)

const supabase = useSupabase()

const setTagData = () => {
	if (props.plan) {
		editItem.value = {
			description: props.plan.description || '',
			amount: props.plan.amount,
			currency: props.plan.currency || '',
			is_income: props.plan.is_income || false,
		}

		if (props.plan?.plan_tags?.length) {
			selectedTags.value = props.plan.plan_tags.map((tr) => ({
				id: tr.tags.id,
				name: tr.tags.name,
				existed: true,
			}))
		}
	}
}

onMounted(() => {
	if (props.plan) {
		setTagData()
	}
})

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

const deleteTagsRelationship = async (plan_id: number, tags: ITag[]) => {
	const { error } = await supabase
		.from('plan_tags')
		.delete()
		.match({
			plan_id,
			tag_id: tags.map((t) => t.id),
		})

	if (error) {
		console.error('Failed to remove tag', error)
		// maybe show a toast or undo button
	}
}

const createTagsRelationship = async (plan_id: number, tags: ITag[]) => {
	const filteredTags = tags.reduce((acc, item) => {
		if (acc.some((i) => i.id === item.id)) return acc
		if (item.existed) return acc

		return [...acc, item]
	}, [] as ITag[])

	const planTags = filteredTags.map((t) => ({
		plan_id,
		tag_id: t.id,
		space_id: props.numericSpaceId,
	}))

	await supabase.from('plan_tags').insert(planTags)
}

// * Submit
const isLoading = ref(false)
const createPlan = async () => {
	if (isDisabled.value) return

	isLoading.value = true

	try {
		const { data } = await supabase
			.from('plans')
			.insert({
				...editItem.value,
				amount: editItem.value.amount || 0,
				space_id: props.numericSpaceId,
				period_month_year: props.period,
			})
			.select('id')
			.single()

		const plan_id = data?.id
		if (plan_id && selectedTags.value.length) {
			await createTagsRelationship(plan_id, selectedTags.value)
		}

		editItem.value = {
			...clearPlan,
		}
		selectedTags.value = []
	} catch (err) {
		console.error('error:', err)
	} finally {
		isLoading.value = false
	}
}

const editPlan = async (id: number) => {
	if (isDisabled.value) return

	isLoading.value = true

	try {
		await supabase
			.from('plans')
			.update({ ...editItem.value })
			.eq('id', id)

		if (props.plan?.id && selectedTags.value.length) {
			await createTagsRelationship(props.plan.id, selectedTags.value)
		}

		if (props.plan?.id && tagsToBeRemoved.value.length) {
			await deleteTagsRelationship(props.plan.id, tagsToBeRemoved.value)
		}
	} catch (err) {
		console.error('error:', err)
	} finally {
		isLoading.value = false
	}
}

const handleSubmitForm = async () => {
	if (props.plan) {
		await editPlan(props.plan.id)
	} else {
		await createPlan()
	}

	emit('sent')
}
</script>

<template>
	<form @submit.prevent="handleSubmitForm">
		<div>
			<div class="mb-4">
				<h4 class="font-medium leading-none">Create new plan</h4>
				<p class="text-sm text-muted-foreground">Fill the form below to create a new plan.</p>
			</div>
			<div>
				<div class="mb-2">
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
					<Input
						id="description"
						type="text"
						v-model="editItem.description"
						class="col-span-2 h-8"
						placeholder="Description"
					/>
				</div>
				<div class="mb-2">
					<Input id="amount" type="number" v-model="editItem.amount" class="col-span-2 h-8" placeholder="Amount" />
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
					<Checkbox v-model="editItem.is_income" />
					<label for="is_income" class="ml-2">Income</label>
				</div>

				<Button type="submit" class="col-span-2 h-8 w-full" :disabled="isDisabled || isLoading">
					<Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
					Save
				</Button>
			</div>
		</div>
	</form>
</template>
