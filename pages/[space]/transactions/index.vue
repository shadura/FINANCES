<script setup lang="ts"></script>

<template>
	<div>
		<h1 class="text-2xl font-bold">Transactions</h1>

		<div class="mt-8 grid grid-cols-2 gap-4" style="grid-template-columns: 2fr 1fr">
			<div>
				<TablesTransactionsList />
			</div>
			<div>
				<WidgetsAccountsInfo />
			</div>
		</div>
	</div>
</template>
