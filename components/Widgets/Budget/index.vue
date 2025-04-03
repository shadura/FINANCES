<script setup lang="ts">
interface IPlanListProps {
	period: string
}

const props = defineProps<IPlanListProps>()

const numericSpaceId = Number(useRoute().params.space)

const { list: plansList, getList: getPlans, deletePlan } = usePlans()
const { list: tagsList, getList: getTags } = useTags()
const { list: accountList, getList: getAccounts } = useAccounts()
const { getList: getTransactions, deleteTransaction } = useTransactions()

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

const updateData = (type?: 'plan' | 'transaction') => {
	if (!type || type === 'plan') {
		getPlans(props.period)
	}

	if (!type || type === 'transaction') {
		getTransactions(props.period)
	}
}
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>Plan</CardTitle>
			<CardDescription>Manage your budget plans here.</CardDescription>
		</CardHeader>
		<CardContent>
			<div class="flex gap-2 items-center justify-start">
				<Popover>
					<PopoverTrigger as-child>
						<Button>Add plan</Button>
					</PopoverTrigger>
					<PopoverContent class="w-140">
						<FormsPlan :tagsList :accountList :numericSpaceId :period="props.period" @sent="updateData('plan')" />
					</PopoverContent>
				</Popover>

				<Popover>
					<PopoverTrigger as-child>
						<Button variant="outline">Add empty transaction</Button>
					</PopoverTrigger>
					<PopoverContent class="w-140">
						<FormsTransaction
							:accountList="accountList"
							:tagsList="tagsList"
							:numericSpaceId="numericSpaceId"
							:period="props.period"
							@sent="updateData('transaction')"
						/>
					</PopoverContent>
				</Popover>
			</div>

			<Tabs default-value="list" class="w-full mt-6">
				<TabsList>
					<TabsTrigger value="list"> List </TabsTrigger>
					<TabsTrigger value="tags"> By Tags </TabsTrigger>
					<TabsTrigger value="accounts"> By Accounts </TabsTrigger>
				</TabsList>
				<TabsContent value="list">
					<WidgetsBudgetList
						:list="plansList"
						:tagsList="tagsList"
						:accountList="accountList"
						:numericSpaceId="numericSpaceId"
						:period="props.period"
						class="mt-4"
						@sent:plan="updateData('plan')"
						@sent:transaction="updateData('transaction')"
						@delete:plan="deletePlan"
						@delete:transaction="deleteTransaction"
					/>
				</TabsContent>
				<TabsContent value="tags">
					<WidgetsBudgetTags />
				</TabsContent>
				<TabsContent value="accounts">
					<WidgetsBudgetAccounts />
				</TabsContent>
			</Tabs>
		</CardContent>
	</Card>
</template>
