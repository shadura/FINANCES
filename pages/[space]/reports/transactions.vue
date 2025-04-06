<script setup lang="ts">
import dayjs from 'dayjs'
import { useFilter } from 'reka-ui'
import { PRIMARY_CURRENCY, SECONDARY_CURRENCY } from '~/const/currency.const'
import type { Tag, TransactionWithTags } from '@/types/index.types'

const { getList: getTags, list: tags } = useTags()
const { getTransactionsReport, isReportLoading } = useReport()
const { convert } = useCurrency()

const now = dayjs()

const form = ref({
	fromDate: now.startOf('month').format('YYYY-MM-DD'),
	toDate: now.endOf('month').format('YYYY-MM-DD'),
})

const result = ref<{ sum: number; list: TransactionWithTags[] }>({ sum: 0, list: [] })
const getResult = async () => {
	if (!form.value.fromDate || !form.value.toDate) return

	const tagsIds = selectedTags.value.map((tag) => tag.id || 0).filter(Boolean) as number[]
	result.value = await getTransactionsReport(form.value.fromDate, form.value.toDate, tagsIds)
}

// * Tags
const selectedTags = ref<Partial<Tag>[]>([])
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

	getResult()
}

const handleRemoveTag = () => {
	setTimeout(() => {
		getResult()
	}, 100)
}

const handleTagClick = (tag: Partial<Tag>) => {
	const isTagSelected = selectedTags.value.some((t) => t.id === tag.id)
	if (isTagSelected) return

	selectedTags.value.push(tag)
	open.value = false
	getResult()
}

onMounted(() => {
	getTags()
})

watch(
	form,
	async () => {
		await getResult()
	},
	{ deep: true, immediate: true },
)

interface ISlitedListItem {
	year: string
	list: TransactionWithTags[]
}

const splitedList = computed(() => {
	if (!result.value.list.length) return []

	return result.value.list
		.reduce((acc, item): ISlitedListItem[] => {
			const year = dayjs(item.date).format('YYYY')
			const itemIndex = acc.findIndex((i) => i.year === year)

			if (itemIndex === -1) {
				return [...acc, { year, list: [item] }]
			} else {
				acc[itemIndex].list.push(item)
				return acc
			}
		}, [] as ISlitedListItem[])
		.sort((a, b) => dayjs(b.year).diff(dayjs(a.year)))
})
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Transactions report</h1>

		<div class="mt-4 flex gap-2 justify-start flex-wrap">
			<div>
				<Input
					id="name"
					type="date"
					v-model="form.fromDate"
					class="col-span-2 h-8"
					placeholder="YYYY-MM-DD"
					mask="YYYY-MM-DD"
				/>
			</div>
			<div>
				<Input
					id="name"
					type="date"
					v-model="form.toDate"
					class="col-span-2 h-8"
					placeholder="YYYY-MM-DD"
					mask="YYYY-MM-DD"
				/>
			</div>
			<div>
				<Combobox v-model:open="open" :ignore-filter="true">
					<ComboboxAnchor as-child>
						<TagsInput
							v-model="selectedTags"
							:display-value="(tag: any) => tag.name"
							:key-value="(tag: any) => tag.id"
							class="px-2 gap-2 w-80"
							@remove-tag="handleRemoveTag"
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
								<ComboboxItem v-for="tag in filteredTags" :key="tag.id" :value="tag" @select.prevent="handleSelectTag">
									{{ tag.name }}
								</ComboboxItem>
							</ComboboxGroup>
						</ComboboxList>
					</ComboboxAnchor>
				</Combobox>
			</div>
		</div>

		<div class="mt-12">
			<div>
				<div class="mb-1 text-sm text-muted-foreground">Result</div>
				<div class="font-bold text-lg">{{ useFormatAmount(result.sum, PRIMARY_CURRENCY) }}</div>
				<div class="text-xs">
					{{ useFormatAmount(convert(result.sum, PRIMARY_CURRENCY, SECONDARY_CURRENCY), SECONDARY_CURRENCY) }}
				</div>
			</div>

			<div class="mt-12">
				<div v-if="isReportLoading">
					<Loader />
				</div>

				<div v-else>
					<div v-for="item in splitedList" :key="item.year">
						<Separator :label="item.year" class="mt-10 mb-6" />
						<WidgetsTransaction
							v-for="transaction in item.list"
							:key="transaction.id"
							:transaction
							showTags
							hideOptions
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
