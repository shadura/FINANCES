<script setup lang="ts">
const { getSpace } = useSpace()

const spaceId = useRoute().params.space as string
const space = await getSpace(Number(spaceId))

const { getNetWorhInfo, getList: getAccountsList } = useAccounts()

onMounted(() => {
	getAccountsList()
})
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">{{ space.name }} - Space dashboard</h1>

		<div class="mt-6 grid grid-cols-2 gap-4" style="grid-template-columns: 1fr 2fr">
			<WidgetsNetWorthPie :data="getNetWorhInfo" />
			<!-- <div>
				<pre>{{ getNetWorhInfo }}</pre>
			</div> -->

			<!-- <Card>
				<CardHeader>
					<CardTitle>Space members</CardTitle>
				</CardHeader>
				<CardContent>
					<ul>
						<li v-for="member in space.members" :key="member.user_id">- {{ member.name }}</li>
					</ul>
				</CardContent>
			</Card> -->
		</div>
	</div>
</template>
