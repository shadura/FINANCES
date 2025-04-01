<script setup lang="ts">
import { Edit, Trash, CircleFadingPlus } from 'lucide-vue-next'
import getFormatedDescription from '@/utils/getFormatedDescription'

interface IPlanListProps {
	period: string
}

const props = defineProps<IPlanListProps>()

const numericSpaceId = Number(useRoute().params.space)

const { getList: getPlans, isListLoading, list, deletePlan } = usePlans()
const { getList: getTransactions } = useTransactions()
const { list: tagsList, getList: getTags } = useTags()
const { list: accountList, getList: getAccounts } = useAccounts()

watch(
	() => props.period,
	() => {
		getPlans(props.period)
	},
	{ immediate: true },
)

onMounted(() => {
	getTags()
	getAccounts()
})

const updateData = () => {
	getTransactions(props.period)
}
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

			<Tabs v-else default-value="list" class="w-full mt-4">
				<TabsList>
					<TabsTrigger value="list"> Plan list </TabsTrigger>
					<TabsTrigger value="tags"> By Tags </TabsTrigger>
					<TabsTrigger value="accounts"> By Accounts </TabsTrigger>
				</TabsList>
				<TabsContent value="list">
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
												<FormsTransaction :accountList :tagsList :numericSpaceId :plan @sent="updateData" />
											</PopoverContent>
										</Popover>

										<Popover>
											<PopoverTrigger as-child>
												<Button variant="ghost" size="icon">
													<Edit />
												</Button>
											</PopoverTrigger>
											<PopoverContent class="w-140">
												<FormsPlan
													:tagsList
													:accountList
													:numericSpaceId
													:period="props.period"
													:plan
													@sent="updateData"
												/>
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
				</TabsContent>
				<TabsContent value="tags">
					<WidgetsPlannedTags />
				</TabsContent>
				<TabsContent value="accounts">
					<WidgetsPlannedAccounts />
				</TabsContent>
			</Tabs>
		</CardContent>
	</Card>
</template>
