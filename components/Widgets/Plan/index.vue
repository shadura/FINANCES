<script setup lang="ts">
interface IPlanListProps {
	period: string
}

const props = defineProps<IPlanListProps>()

const numericSpaceId = Number(useRoute().params.space)

const { list: plansList, getList: getPlans, deletePlan } = usePlans()
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
	getPlans(props.period)
}
</script>

<template>
	<Card>
		<CardHeader>
			<CardTitle>Plan</CardTitle>
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

			<!-- <div v-if="isListLoading">
				<Loader />
			</div> -->

			<Tabs default-value="list" class="w-full mt-4">
				<TabsList>
					<TabsTrigger value="list"> List </TabsTrigger>
					<TabsTrigger value="tags"> By Tags </TabsTrigger>
					<TabsTrigger value="accounts"> By Accounts </TabsTrigger>
				</TabsList>
				<TabsContent value="list">
					<WidgetsPlanList
						:list="plansList"
						:tagsList="tagsList"
						:accountList="accountList"
						:numericSpaceId="numericSpaceId"
						:period="props.period"
						@delete="deletePlan"
						@sent="updateData"
					/>
				</TabsContent>
				<TabsContent value="tags">
					<WidgetsPlanTags />
				</TabsContent>
				<TabsContent value="accounts">
					<WidgetsPlanAccounts />
				</TabsContent>
			</Tabs>
		</CardContent>
	</Card>
</template>
