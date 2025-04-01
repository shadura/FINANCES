<script setup lang="ts">
const { getSpace } = useSpace()

const spaceId = useRoute().params.space as string
const space = await getSpace(Number(spaceId))
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Settings</h1>

		<div class="grid grid-cols-2 gap-4 mt-8" style="grid-template-columns: 2fr 1fr">
			<div>
				<WidgetsAccounts />
			</div>
			<div>
				<Card>
					<CardHeader>
						<CardTitle>Space members</CardTitle>
					</CardHeader>
					<CardContent>
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
