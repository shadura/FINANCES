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
		getAccounts()
	}
}
</script>

<template>
	<Card>
		<CardHeader class="p-4 md:p-6">
			<CardTitle>Plan/Transaction</CardTitle>
			<CardDescription>Manage your plans and transactions here.</CardDescription>
		</CardHeader>
		<CardContent class="p-4 md:p-6">
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

			<Tabs default-value="plan" class="w-full mt-6">
				<TabsList>
					<TabsTrigger value="plan"> Plan </TabsTrigger>
					<TabsTrigger value="tags"> Tags </TabsTrigger>
					<TabsTrigger value="accounts"> Accounts </TabsTrigger>
					<TabsTrigger value="transactions"> Transactions </TabsTrigger>
				</TabsList>
				<TabsContent value="plan">
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
				<TabsContent value="transactions">
					<WidgetsBudgetTransactions
						:accountList="accountList"
						:tagsList="tagsList"
						:numericSpaceId="numericSpaceId"
						:period="props.period"
						class="mt-4"
						@sent="updateData('transaction')"
						@delete="(id: number) => deleteTransaction(id)"
					/>
				</TabsContent>
			</Tabs>
		</CardContent>
	</Card>
</template>
