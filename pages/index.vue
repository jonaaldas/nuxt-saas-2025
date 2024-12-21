<script setup lang="ts">
import { onMounted } from "vue";
import Navbar from "../components/landing/Navbar.vue";
import Hero from "../components/landing/Hero.vue";
import HowItWorks from "../components/landing/HowItWorks.vue";
import Pricing from "../components/Pricing.vue";
import Contact from "../components/landing/Contact.vue";
import FAQ from "../components/landing/FAQ.vue";
import Footer from "../components/landing/Footer.vue";

useHead({
  htmlAttrs: {
    class: "dark",
  },
  meta: [
    { name: "color-scheme", content: "dark" },
    { name: "theme-color", content: "#000000" },
  ],
});

onMounted(() => {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const storedTheme = localStorage.getItem("theme");

  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
});
</script>

<template>
  <div class="bg-background text-foreground">
    <Navbar />
    <Hero />
    <HowItWorks />
    <Pricing />
    <Contact />
    <FAQ />
    <Footer />
  </div>
</template>

<style>
/* Prevent flash of light mode */
:root {
  color-scheme: dark;
}

/* Ensure smooth transitions */
html.dark {
  color-scheme: dark;
}

/* Optional: Add transition for theme changes */
:root {
  transition: background-color 0.3s ease;
}
</style>
