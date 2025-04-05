<script setup lang="ts">
const { getSpace } = useSpace()

const spaceId = useRoute().params.space as string
const space = await getSpace(Number(spaceId))
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Settings</h1>

		<div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
			<div>
				<WidgetsAccounts />
			</div>
			<div>
				<Card>
					<CardHeader class="p-4 md:p-6">
						<CardTitle>Space members</CardTitle>
					</CardHeader>
					<CardContent class="p-4 md:p-6">
						<ul>
							<li v-for="member in space.members" :key="member.user_id">{{ member.name }}</li>
						</ul>
					</CardContent>
				</Card>

				<WidgetsTags class="mt-4" />
			</div>
		</div>
	</div>
</template>
