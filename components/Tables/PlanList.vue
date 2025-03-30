<script setup lang="ts">
import { Edit, Trash } from 'lucide-vue-next'

interface IPlanListProps {
	period: number
}

const props = defineProps<IPlanListProps>()

const numericSpaceId = Number(useRoute().params.space)

const { getPlans, isListLoading, list, updateData, deletePlan } = usePlans()
const { list: tagsList, getTags } = useTags()
const { list: accountList, updateData: updatedAccountsData } = useAccounts()

watch(
	() => props.period,
	() => {
		getPlans()
	},
	{ immediate: true },
)

onMounted(() => {
	getTags()
	updatedAccountsData()
})
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>Plan list</CardTitle>
			<CardDescription>Manage your budget plans here.</CardDescription>
		</CardHeader>
		<CardContent>
			<Popover>
				<PopoverTrigger as-child>
					<Button>Add plan</Button>
				</PopoverTrigger>
				<PopoverContent class="w-140">
					<FormsPlan :tagsList :accountList :numericSpaceId :period="props.period" @sent="updateData" />
				</PopoverContent>
			</Popover>

			<div v-if="isListLoading">
				<Loader />
			</div>

			<Table v-else class="mt-4">
				<TableHeader>
					<TableRow>
						<TableHead>Tags</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Description</TableHead>
						<TableHead class="text-right w-[100px]">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow v-for="plan in list" :key="plan.id">
						<TableCell class="font-medium">
							<div class="flex gap-1">
								<Tag v-if="plan.is_income" color="#13dd13"> Income </Tag>
								<Tag v-for="tag in plan.plan_tags" :key="tag.tags.id" :color="tag.tags.color">
									{{ tag.tags.name }}
								</Tag>
							</div>
						</TableCell>
						<TableCell> {{ plan.amount }} {{ plan.currency }} </TableCell>

						<TableCell class="font-medium">
							{{ plan.description }}
						</TableCell>

						<TableCell class="text-right">
							<div class="flex gap-1 justify-end">
								<Popover>
									<PopoverTrigger as-child>
										<Button variant="ghost" size="icon">
											<Edit />
										</Button>
									</PopoverTrigger>
									<PopoverContent class="w-140">
										<FormsPlan :tagsList :accountList :numericSpaceId :period="props.period" :plan @sent="updateData" />
									</PopoverContent>
								</Popover>

								<Button variant="ghost" size="icon" @click="deletePlan(plan.id)">
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
