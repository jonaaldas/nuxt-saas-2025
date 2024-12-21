<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Monitor } from "lucide-vue-next";

const colorMode = useColorMode();

const modes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

const currentIcon = computed(() => {
  if (colorMode.value === "dark") return Moon;
  return Sun;
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="icon">
        <component :is="currentIcon" class="h-[1.2rem] w-[1.2rem] transition-all" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="mode in modes"
        :key="mode.value"
        @click="colorMode.preference = mode.value"
        :class="{ 'bg-accent': colorMode.preference === mode.value }">
        <component :is="mode.icon" class="mr-2 h-4 w-4" />
        {{ mode.label }}
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
