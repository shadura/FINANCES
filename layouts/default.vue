<template>
	<SidebarProvider>
		<AppSidebar />
		<main>
			<SidebarTrigger />
			<div class="pt-6 sm:px-6 lg:px-8"><slot /></div>
		</main>
	</SidebarProvider>
</template>
