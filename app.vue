<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from "./components/ui/toast";
const colorMode = useColorMode();

// Add script to head to prevent flickering
useHead({
  script: [
    {
      innerHTML: `
        try {
          const savedMode = localStorage.getItem('color-mode');
          if (savedMode === 'dark' || (savedMode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {}
      `,
      tagPriority: "critical",
    },
  ],
});

// Initialize color mode from system preference or stored value
onMounted(() => {
  // Get the saved preference from localStorage
  const savedMode = localStorage.getItem("color-mode");

  // If there's a saved preference, use it
  if (savedMode && ["light", "dark", "system"].includes(savedMode)) {
    colorMode.preference = savedMode;
    if (savedMode === "system") {
      // If system preference, check the media query
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      colorMode.value = isDark ? "dark" : "light";
    } else {
      colorMode.value = savedMode;
    }
  } else {
    // If no saved preference, default to system
    colorMode.preference = "system";
    colorMode.value = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Apply the theme immediately
  updateTheme(colorMode.value);
});

// Watch for changes and update HTML class
watch(() => colorMode.value, updateTheme, { immediate: true });

// Watch for preference changes and save to localStorage
watch(
  () => colorMode.preference,
  (newPreference) => {
    localStorage.setItem("color-mode", newPreference);
  },
  { immediate: true }
);

// Function to update theme
function updateTheme(theme: string) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// Listen for system theme changes
onMounted(() => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", (e) => {
    if (colorMode.preference === "system") {
      colorMode.value = e.matches ? "dark" : "light";
    }
  });
});
</script>

<style>
/* Prevent flash of wrong theme */
:root {
  color-scheme: light;
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
}

.dark:root {
  color-scheme: dark;
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
}

html {
  @apply antialiased;
}

body {
  @apply bg-background text-foreground transition-colors duration-300;
}

/* Add this to prevent initial transition flash */
.color-mode-transition-none * {
  transition: none !important;
}
</style>
