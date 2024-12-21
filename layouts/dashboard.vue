<script setup lang="ts">
import { ref, markRaw, shallowRef } from "vue";
import Upload from "~/components/dashboard/Upload.vue";
import Settings from "~/components/dashboard/Settings.vue";

const userDropdownOpen = ref(false);

// Create a map of tab names to components
const tabComponents = {
  upload: markRaw(Upload),
  settings: markRaw(Settings),
  // Add more components as needed
} as const;

// Create a type for valid tab names
type TabName = keyof typeof tabComponents;

// Function to get component based on tab name
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
