<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>

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
