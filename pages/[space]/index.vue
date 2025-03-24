<script setup lang="ts">
const { getSpace } = useSpace()

const spaceId = useRoute().params.space as string
const space = await getSpace(Number(spaceId))
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">{{ space.name }} - Space dashboard</h1>

		<div class="mt-6">
			<Card>
				<CardHeader>
					<CardTitle>Space members</CardTitle>
				</CardHeader>
				<CardContent>
					<ul>
						<li v-for="member in space.members" :key="member.user_id">- {{ member.name }}</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	</div>
</template>
