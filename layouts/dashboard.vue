<script setup lang="ts">
import { ref, markRaw, shallowRef, computed, onMounted } from "vue";
import { useIsAuthenticated, useIsPaid } from "~/composables/states";
import Profile from "~/components/dashboard/Profile.vue";
import Pricing from "~/components/Pricing.vue";
import Billing from "~/components/dashboard/Billing.vue";

const isAuthenticated = useIsAuthenticated();
const isPaid = useIsPaid();

const tabComponents = {
  profile: markRaw(Profile),
  pricing: markRaw(Pricing),
  billing: markRaw(Billing),
} as const;

type TabName = keyof typeof tabComponents;

const getTabComponent = (tab: string) => {
  return tabComponents[tab as TabName] || null;
};

// Get default tab based on auth state
const getDefaultTab = computed(() => {
  if (isAuthenticated.value && isPaid.value) {
    return "profile";
  }
  return "pricing";
});

onMounted(() => {
  const route = useRoute();
  if (!route.query.tab) {
    getTabComponent(getDefaultTab.value);
  } else {
    getTabComponent(route.query.tab as string);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <SidebarComponent>
      <template #content="{ tab }">
        <main class="p-6">
          <component :is="getTabComponent(tab)" v-if="getTabComponent(tab)" />
          <!-- <slot v-else /> -->
        </main>
      </template>
    </SidebarComponent>
  </div>
</template>
