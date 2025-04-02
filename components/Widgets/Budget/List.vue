<script setup lang="ts">
import type { Account, PlanWithTags, Tag } from '~/types/index.types'
import { Edit, Trash, CircleFadingPlus, ChevronsUpDown, EllipsisVertical, CornerDownRight, Plus } from 'lucide-vue-next'
import getFormatedDescription from '@/utils/getFormatedDescription'

const props = defineProps<{
	list: PlanWithTags[]
	tagsList: Tag[]
	accountList: Account[]
	numericSpaceId: number
	period: string
}>()

const emit = defineEmits(['sent:plan', 'delete:plan', 'sent:transaction', 'delete:transaction'])
</script>

<template>
	<div>
		<WidgetsBudgetListItem
			v-for="plan in props.list"
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
	</div>
</template>
