<script setup lang="ts">
import dayjs from 'dayjs'
import { useFilter } from 'reka-ui'
import { PRIMARY_CURRENCY, SECONDARY_CURRENCY } from '~/const/currency.const'
import type { DB, Tag } from '@/types/index.types'
import type { ECurrency } from '@/types/enums/currency'
import getFormatedDescription from '@/utils/getFormatedDescription'

type TransactionReportItem = DB<'transactions'> & {
	transaction_tags: { id: number; tags: { id: number; name: string; color: string } }[]
	account_from_info: DB<'accounts'> | null
	account_to_info: DB<'accounts'> | null
}

const { getTags, list: tags } = useTags()
const { getTransactionsReport, isReportLoading } = useReport()
const { convert } = useCurrency()

const now = dayjs()

const form = ref({
	fromDate: now.startOf('month').format('YYYY-MM-DD'),
	toDate: now.endOf('month').format('YYYY-MM-DD'),
})

const result = ref<{ sum: number; list: TransactionReportItem[] }>({ sum: 0, list: [] })
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
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Transactions report</h1>

		<div class="mt-4 flex gap-2 justify-start">
			<div>
				<Input
					id="name"
					type="text"
					v-model="form.fromDate"
					class="col-span-2 h-8"
					placeholder="YYYY-MM-DD"
					mask="YYYY-MM-DD"
				/>
			</div>
			<div>
				<Input
					id="name"
					type="text"
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

				<ul v-else>
					<li
						v-for="item in result.list"
						:key="item.id"
						class="flex justify-between border-b last:border-b-0 mb-2 pb-2"
					>
						<div>
							<span class="inline-block mr-2 w-16">{{ dayjs(item.date).format('DD MMM') }}</span>

							<Tag
								v-for="tag in item.transaction_tags"
								:key="tag.id"
								:color="tag.tags.color"
								class="cursor-pointer mr-1"
								@click="handleTagClick(tag.tags)"
								>{{ tag.tags.name }}</Tag
							>

							<span class="inline-block ml-2" v-html="getFormatedDescription(item.description)" />
						</div>
						<div class="text-right">
							<span>{{ useFormatAmount(item.amount_debit, item.account_from_info?.currency as ECurrency) }}</span>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
