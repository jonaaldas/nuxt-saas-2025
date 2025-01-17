<style scoped></style>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "./ui/sidebar";

const router = useRouter();
let tab = ref("");
const { loggedIn, user, session, fetch, clear } = useUserSession();

// Get default tab based on auth state
const defaultTab = computed(() => {
  if (loggedIn.value && user.value?.isPaid === true) {
    return "profile";
  }
  return "pricing";
});

// Handle dashboard breadcrumb click
const handleDashboardClick = () => {
  router.push({
    path: "/dashboard",
    query: { tab: defaultTab.value },
  });
};

// Compute navigation items based on auth state
const navigationItems = computed(() => {
  const baseItems = [
    {
      title: "Profile",
      tab: "profile",
    },
  ];

  // Only show billing if user is authenticated and paid
  if (loggedIn.value && user.value?.isPaid === true) {
    baseItems.push({
      title: "Billing",
      tab: "billing",
    });
  }

  // Only show pricing if user is authenticated but not paid
  if (loggedIn.value && !user.value?.isPaid) {
    baseItems.push({
      title: "Pricing",
      tab: "pricing",
    });
  }
  console.log("baseItems", baseItems);
  return baseItems;
});

const data = ref({
  title: "Dashboard",
  navNow: navigationItems,
});

const logOut = () => {
  clear();
  router.push("/");
};

onMounted(() => {
  const url = new URL(window.location.href);
  const tabUrl = url.searchParams.get("tab");
  if (tabUrl) {
    tab.value = tabUrl as "profile" | "billing" | "pricing";
  } else {
    tab.value = defaultTab.value;
  }
});
</script>

<template>
  <SidebarProvider>
    <Sidebar class="p-4">
      <SidebarHeader class="text-base sm:text-lg"> {{ data.title }} </SidebarHeader>

      <SidebarGroup>
        <SidebarGroupLabel>Features</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem
            v-for="item in navigationItems"
            :key="item.title"
            @click="
              (event) => {
                event.preventDefault();
                tab = item.tab;
              }
            ">
            <p
              class="text-lg p-2 rounded-md transition-colors duration-200 hover:bg-gray-50"
              :class="{
                'bg-blue-50 text-blue-700 font-medium': tab === item.tab,
                'text-gray-600 hover:text-gray-900': tab !== item.tab,
              }">
              {{ item.title }}
            </p>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarRail />
      <SidebarFooter>
        <Button @click="logOut"> Log out </Button>
      </SidebarFooter>
    </Sidebar>
    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink href="/"> Home </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem class="hidden md:block">
              <BreadcrumbLink @click.prevent="handleDashboardClick"> Dashboard </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator class="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage class="capitalize"> {{ tab }} </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <slot v-bind="$attrs" name="content" :tab="tab" />
    </SidebarInset>
  </SidebarProvider>
</template>
