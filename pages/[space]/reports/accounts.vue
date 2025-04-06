<script setup lang="ts">
import dayjs from 'dayjs'

const periodList = [
	{ value: 'month', label: 'Month' },
	{ value: 'quarter', label: 'Quarter' },
	{ value: 'year', label: 'Year' },
]

const { getList: getAccounts, list: accounts } = useAccounts()
const { isReportLoading, getAccountBalanceHistory } = useReport()

const form = ref({
	accountId: null,
	period: 'month',
})

const getAccount = computed(() => {
	if (!form.value.accountId) return null
	const account = accounts.value?.find((account) => account.id === form.value.accountId)
	return account
})

const getAccountCurrency = computed(() => {
	if (!form.value.accountId) return '-'
	const account = accounts.value?.find((account) => account.id === form.value.accountId)
	return account?.currency || '-'
})

const result = ref<any[]>([])
const getResult = async () => {
	if (!form.value.accountId || !form.value.period) return

	const account = getAccount.value
	if (!account) return

	const data = await getAccountBalanceHistory(account, form.value.period as 'month' | 'quarter' | 'year')
	result.value = data
}

watch(
	form,
	async () => {
		await getResult()
	},
	{ deep: true },
)

onMounted(() => {
	getAccounts()
})
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Accounts report</h1>

		<div class="mt-4 flex gap-2 justify-start flex-wrap">
			<div>
				<Select v-model="form.period">
					<SelectTrigger class="col-span-2 w-[100px]">
						<SelectValue placeholder="Account" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem v-for="period in periodList" :value="period.value" :key="period.value">
								{{ period.label }}
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div>
				<Select v-model="form.accountId">
					<SelectTrigger class="col-span-2 w-[200px]">
						<SelectValue placeholder="Account" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem v-for="account in accounts" :value="account.id" :key="account.id">
								{{ account.name }}
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>

		<div class="mt-12">
			<ChartsLine v-if="result.length" :data="result" :currency="getAccountCurrency" />
			<!-- <pre>{{ getAccountCurrency }} - {{ result }}</pre> -->
			<!-- <div>
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
			</div> -->
		</div>
	</div>
</template>
