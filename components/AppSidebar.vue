<script setup lang="ts">
import {
	CalendarSync,
	Wallet,
	Settings,
	ChevronUp,
	ChartCandlestick,
	Focus,
	User2,
	ArrowLeftRight,
} from 'lucide-vue-next'

const space = computed(() => Number(useRoute().params.space))

// Menu items.
const items = computed(() => [
	{
		title: 'Dashboard',
		url: `/${space.value}`,
		icon: Focus,
	},
	{
		title: 'Planner',
		url: `/${space.value}/planner`,
		icon: Wallet,
	},
	{
		title: 'Transactions',
		url: `/${space.value}/transactions`,
		icon: ArrowLeftRight,
	},
	{
		title: 'Subscriptions',
		url: `/${space.value}/subscriptions`,
		icon: CalendarSync,
		soon: true,
	},
	{
		title: 'Reports',
		url: ``,
		icon: ChartCandlestick,
		subItems: [
			{
				title: 'Transactions',
				url: `/${space.value}/reports/transactions`,
			},
		],
	},
	{
		title: 'Space Settings',
		url: `/${space.value}/settings`,
		icon: Settings,
	},
])

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
				<SidebarGroupLabel>Navigation</SidebarGroupLabel>
				<SidebarGroupContent>
					<SidebarMenu>
						<SidebarMenuItem v-for="item in items" :key="item.title">
							<SidebarMenuButton asChild>
								<nuxt-link v-if="item.url" :to="item.url">
									<component :is="item.icon" />
									<span>{{ item.title }}</span>
									<span v-if="item.soon" class="text-xs text-gray-500 bg-gray-200 rounded-lg px-1 py-0.5">soon</span>
								</nuxt-link>

								<span v-else>
									<component :is="item.icon" />
									<span>{{ item.title }}</span>
									<span v-if="item.soon" class="text-xs text-gray-500 bg-gray-200 rounded-lg px-1 py-0.5">soon</span>
								</span>

								<template v-if="item.subItems">
									<SidebarMenuSub>
										<SidebarMenuSubItem v-for="subItem in item.subItems" :key="subItem.title">
											<SidebarMenuSubButton asChild>
												<nuxt-link :to="subItem.url">
													<span>{{ subItem.title }}</span>
												</nuxt-link>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									</SidebarMenuSub>
								</template>
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
