<script setup lang="ts">
import { onMounted } from "vue";
import Navbar from "../components/landing/Navbar.vue";
import Hero from "../components/landing/Hero.vue";
import Benefits from "../components/landing/Benefits.vue";
import Features from "../components/landing/Features.vue";
import Services from "../components/landing/Services.vue";
import HowItWorks from "../components/landing/HowItWorks.vue";
import Sponsors from "../components/landing/Sponsors.vue";
import Testimonials from "../components/landing/Testimonials.vue";
import Team from "../components/landing/Team.vue";
import Pricing from "../components/Pricing.vue";
import Community from "../components/landing/Community.vue";
import Contact from "../components/landing/Contact.vue";
import FAQ from "../components/landing/FAQ.vue";
import Footer from "../components/landing/Footer.vue";

// SEO and dark mode meta
useHead({
  htmlAttrs: {
    class: "dark",
  },
  meta: [
    { name: "color-scheme", content: "dark" },
    { name: "theme-color", content: "#000000" },
  ],
});

// Initialize dark mode
onMounted(() => {
  // Check system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Check localStorage
  const storedTheme = localStorage.getItem("theme");

  // Apply dark mode if either system prefers it or it was previously set
  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  }
});
</script>

<template>
  <div class="bg-background text-foreground">
    <Navbar />
    <Hero />
    <Sponsors />
    <Benefits />
    <Features />
    <Services />
    <HowItWorks />
    <Testimonials />
    <Team />
    <Community />
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
