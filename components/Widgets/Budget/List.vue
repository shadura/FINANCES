<script setup lang="ts">
import type { Account, PlanWithTags, Tag } from '~/types/index.types'
import { Edit, Trash, CircleFadingPlus, ChevronsUpDown, EllipsisVertical, CornerDownRight, Plus } from 'lucide-vue-next'
import getFormatedDescription from '@/utils/getFormatedDescription'
import dayjs from 'dayjs'
import { PRIMARY_CURRENCY } from '~/const/currency.const'

const props = defineProps<{
	list: PlanWithTags[]
	tagsList: Tag[]
	accountList: Account[]
	numericSpaceId: number
	period: string
}>()

const emit = defineEmits(['sent:plan', 'delete:plan', 'sent:transaction', 'delete:transaction'])

const emptyPlanItem: PlanWithTags = {
	id: 0,
	amount: 0,
	currency: PRIMARY_CURRENCY,
	is_income: false,
	preferred_account: null,
	preferred_account_info: undefined,
	plan_tags: [],
	description: 'Not linked transactions',
	created_at: '',
	period_month_year: Number(dayjs(props.period).format('MMYYYY')),
	space_id: props.numericSpaceId,
	is_marked_done: false,
}

const activeList = computed(() => props.list.filter((plan) => !plan.is_marked_done))
const doneList = computed(() => props.list.filter((plan) => plan.is_marked_done))

const isOpenDoneList = ref(false)
</script>

<template>
	<div>
		<WidgetsBudgetListItem
			v-for="plan in activeList"
			:key="plan.id"
			:plan="plan"
			:period="props.period"
			:tagsList="props.tagsList"
			:accountList="props.accountList"
			:numericSpaceId="props.numericSpaceId"
			class="mb-2"
			@sent:plan="emit('sent:plan')"
			@delete:plan="(id) => emit('delete:plan', id)"
			@sent:transaction="emit('sent:transaction')"
			@delete:transaction="(id) => emit('delete:transaction', id)"
		/>

		<WidgetsBudgetListItem
			:plan="emptyPlanItem"
			:period="props.period"
			:tagsList="props.tagsList"
			:accountList="props.accountList"
			:numericSpaceId="props.numericSpaceId"
			class="mb-2"
			@sent:plan="emit('sent:plan')"
			@delete:plan="(id) => emit('delete:plan', id)"
			@sent:transaction="emit('sent:transaction')"
			@delete:transaction="(id) => emit('delete:transaction', id)"
		/>

		<Collapsible v-model:open="isOpenDoneList">
			<div class="mt-12 mb-4">
				<Separator
					:label="`${isOpenDoneList ? 'Hide' : 'Show'} ${doneList.length} done plans`"
					class="w-full block cursor-pointer"
					@click="isOpenDoneList = !isOpenDoneList"
				/>
			</div>
			<CollapsibleContent>
				<WidgetsBudgetListItem
					v-for="plan in doneList"
					:key="plan.id"
					:plan="plan"
					:period="props.period"
					:tagsList="props.tagsList"
					:accountList="props.accountList"
					:numericSpaceId="props.numericSpaceId"
					class="mb-2"
					@sent:plan="emit('sent:plan')"
					@delete:plan="(id) => emit('delete:plan', id)"
					@sent:transaction="emit('sent:transaction')"
					@delete:transaction="(id) => emit('delete:transaction', id)"
				/>
			</CollapsibleContent>
		</Collapsible>
	</div>
</template>
