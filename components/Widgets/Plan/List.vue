<script setup lang="ts">
import type { Account, PlanWithTags, Tag } from '~/types/index.types'

const props = defineProps<{
	list: PlanWithTags[]
	tagsList: Tag[]
	accountList: Account[]
	numericSpaceId: number
	period: string
}>()

const emit = defineEmits(['sent', 'delete'])
</script>

<template>
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead class="w-[180px]">Tags</TableHead>
				<TableHead>Amount</TableHead>
				<TableHead>Preferred account</TableHead>
				<TableHead>Description</TableHead>
				<TableHead class="text-right w-[100px]">Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			<TableRow v-for="plan in list" :key="plan.id">
				<TableCell class="font-medium">
					<div class="flex gap-1">
						<Tag v-if="plan.is_income" color="#E0D7F7"> Income </Tag>
						<Tag v-for="tag in plan.plan_tags" :key="tag.tags.id" :color="tag.tags.color">
							{{ tag.tags.name }}
						</Tag>
					</div>
				</TableCell>
				<TableCell> {{ plan.amount }} {{ plan.currency }} </TableCell>

				<TableCell class="font-medium">
					{{ plan.preferred_account_info?.name || '-' }}
				</TableCell>

				<TableCell class="font-medium">
					<span v-html="getFormatedDescription(plan.description)" />
				</TableCell>

				<TableCell class="text-right">
					<div class="flex gap-1 justify-end">
						<Popover>
							<PopoverTrigger as-child>
								<Button variant="ghost" size="icon">
									<CircleFadingPlus />
								</Button>
							</PopoverTrigger>
							<PopoverContent class="w-140">
								<FormsTransaction :accountList :tagsList :numericSpaceId :plan @sent="emit('sent')" />
							</PopoverContent>
						</Popover>

						<Popover>
							<PopoverTrigger as-child>
								<Button variant="ghost" size="icon">
									<Edit />
								</Button>
							</PopoverTrigger>
							<PopoverContent class="w-140">
								<FormsPlan :tagsList :accountList :numericSpaceId :period="props.period" :plan @sent="emit('sent')" />
							</PopoverContent>
						</Popover>

						<Button variant="ghost" size="icon" @click="emit('delete', plan.id)">
							<Trash color="red" />
						</Button>
					</div>
				</TableCell>
			</TableRow>
		</TableBody>
	</Table>
</template>
