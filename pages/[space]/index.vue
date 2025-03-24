<script setup lang="ts">
const { getSpace } = useSpace()

const spaceId = useRoute().params.space as string
const { space, members } = await getSpace(Number(spaceId))
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
					<pre>{{ members }}</pre>
					<ul>
						<li v-for="member in members" :key="member.user_id">- {{ member.display_name }}</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	</div>
</template>
