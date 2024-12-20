<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- Stats cards -->
      <div
        v-for="(stat, index) in ['Users', 'Revenue', 'Active Plans']"
        :key="index"
        class="bg-white p-6 rounded-lg shadow-sm">
        <h3 class="text-sm font-medium text-gray-500">{{ stat }}</h3>
        <p class="mt-2 text-3xl font-semibold text-gray-900">0</p>
      </div>
    </div>

    <!-- Main content area -->
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
      <p class="text-gray-500">No recent activity</p>
    </div>
  </div>
</template>
