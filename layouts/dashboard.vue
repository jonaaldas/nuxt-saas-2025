<script setup lang="ts">
import { ref, markRaw, shallowRef } from "vue";
import Upload from "~/components/dashboard/Upload.vue";
import Profile from "~/components/dashboard/Profile.vue";
import Pricing from "~/components/Pricing.vue";
import Billing from "~/components/dashboard/Billing.vue";
const userDropdownOpen = ref(false);
const tabComponents = {
  upload: markRaw(Upload),
  profile: markRaw(Profile),
  pricing: markRaw(Pricing),
  billing: markRaw(Billing),
} as const;

type TabName = keyof typeof tabComponents;

const getTabComponent = (tab: string) => {
  return tabComponents[tab as TabName] || null;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <SidebarComponent>
      <template #content="{ tab }">
        <main class="p-6">
          <component :is="getTabComponent(tab)" v-if="getTabComponent(tab)" />
          <slot v-else />
        </main>
      </template>
    </SidebarComponent>
  </div>
</template>
