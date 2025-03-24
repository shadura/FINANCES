<script setup lang="ts">
import { getSpaceMembers } from '~/api/spaces'

const spaceId = useRoute().params.space as string
const members = await getSpaceMembers(spaceId)
</script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Space dashboard</h1>

		<div class="mt-6">
			<Card>
				<CardHeader>
					<CardTitle>Space members</CardTitle>
				</CardHeader>
				<CardContent>
					<ul>
						<li v-for="member in members" :key="member.user_id">- {{ member.display_name }}</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	</div>
</template>
