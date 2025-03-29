<script setup lang="ts"></script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Settings</h1>

		<div class="grid grid-cols-2 gap-4 mt-8" style="grid-template-columns: 2fr 1fr">
			<div>
				<TablesAccountsList />
			</div>
			<div>
				<TablesTagsList />
			</div>
		</div>
	</div>
</template>
