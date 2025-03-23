<script setup lang="ts">
import { CalendarSync, Wallet, Settings, ChevronUp, ChartCandlestick, Carrot, User2 } from 'lucide-vue-next'

// Menu items.
const items = [
	{
		title: 'Budget',
		url: '/budget',
		icon: Wallet,
	},
	{
		title: 'Net Worth',
		url: '/net-worth',
		icon: ChartCandlestick,
	},
	{
		title: 'Subscriptions',
		url: '/subscriptions',
		icon: CalendarSync,
	},
	{
		title: 'Menu',
		url: '/menu',
		icon: Carrot,
	},
	{
		title: 'Space Settings',
		url: '/settings',
		icon: Settings,
	},
]

const user = useSupabaseUser()
const client = useSupabaseClient()

const signOut = async () => {
	await client.auth.signOut()
	navigateTo('/auth')
}
</script>

<template>
	<Sidebar>
		<SidebarHeader>
			<div class="flex items-center">
				<h1 class="text-xl font-bold text-gray-900">Family Flow</h1>
			</div>
		</SidebarHeader>
		<SidebarContent>
			<SidebarGroup>
				<SidebarGroupLabel>Modules</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem v-for="item in items" :key="item.title">
							<SidebarMenuButton asChild>
								<a :href="item.url">
									<component :is="item.icon" />
									<span>{{ item.title }}</span>
								</a>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</SidebarContent>
		<SidebarFooter v-if="user?.user_metadata">
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton>
								<User2 />

								<span>{{ user.user_metadata.name }}</span>
								<ChevronUp class="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent side="top" class="w-[--reka-popper-anchor-width]">
							<DropdownMenuItem @click="signOut">
								<span>Sign out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	</Sidebar>
</template>
