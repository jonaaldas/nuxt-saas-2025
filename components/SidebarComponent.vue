<style scoped></style>
<script setup lang="ts">
import { ref, onMounted } from "vue";

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
let tab = ref("upload");

const data = ref({
  title: "Dashboard",
  navNow: [
    {
      title: "Upload",
      tab: "upload",
    },
    {
      title: "Profile",
      tab: "profile",
    },
    {
      title: "Billing",
      tab: "billing",
    },
    {
      title: "Pricing",
      tab: "pricing",
    },
    {
      title: "Connected Accounts",
      tab: "connected",
    },
    {
      title: "Log out",
      tab: "logout",
    },
  ],
  navComingSoon: [
    {
      title: "See Videos",
      tab: "uploaded",
    },
    {
      title: "Analytics",
      tab: "analytics",
    },
  ],
});

const customerLink = "https://billing.stripe.com/p/login/test_eVa00b6zKa4k7pm4gg";

onMounted(() => {
  const url = new URL(window.location.href);
  const tabUrl = url.searchParams.get("tab");
  if (tabUrl) {
    tab.value = tabUrl as "upload" | "uploaded" | "connected" | "settings" | "analytics" | "billing";
  }
});
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarHeader> {{ data.title }} </SidebarHeader>

      <SidebarGroup>
        <SidebarGroupLabel>Features</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem
            v-for="item in data.navNow"
            :key="item.title"
            @click="
              (event) => {
                event.preventDefault();
                tab = item.tab;
                // item.fn ? item.fn() : null;
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

      <SidebarGroup>
        <SidebarGroupLabel>Coming Soon</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem v-for="item in data.navComingSoon" :key="item.title" class="opacity-50 cursor-not-allowed">
            <p class="text-lg p-2 rounded-md text-gray-400">
              {{ item.title }}
            </p>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarRail />
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
              <BreadcrumbLink href="/dashboard"> Dashboard </BreadcrumbLink>
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
