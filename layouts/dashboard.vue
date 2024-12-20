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
    <Sidebar>
      <template #content="{ tab }">
        <!-- Top header -->
        <header class="h-16 bg-white border-b border-gray-200">
          <div class="px-6 h-full flex items-center justify-between">
            <h1 class="text-xl font-semibold capitalize">
              {{ tab }}
            </h1>

            <!-- User dropdown -->
            <div class="relative">
              <button @click="userDropdownOpen = !userDropdownOpen" class="flex items-center space-x-2">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                  alt="User avatar"
                  class="h-8 w-8 rounded-full" />
                <span class="text-sm font-medium text-gray-700">John Doe</span>
              </button>

              <!-- Dropdown menu -->
              <div v-if="userDropdownOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <NuxtLink to="/dashboard/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </NuxtLink>
                <button class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Page content -->
        <main class="p-6">
          <component :is="getTabComponent(tab)" v-if="getTabComponent(tab)" />
          <slot v-else />
        </main>
      </template>
    </Sidebar>
  </div>
</template>
