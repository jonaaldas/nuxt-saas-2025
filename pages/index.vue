<script setup lang="ts">
import { onMounted } from "vue";
import Navbar from "../components/landing/Navbar.vue";
import Hero from "../components/landing/Hero.vue";
import HowItWorks from "../components/landing/HowItWorks.vue";
import Pricing from "../components/Pricing.vue";
import Contact from "../components/landing/Contact.vue";
import FAQ from "../components/landing/FAQ.vue";
import Footer from "../components/landing/Footer.vue";
</script>

<template>
  <div class="min-h-screen transition-colors duration-300">
    <Navbar />
    <Hero />
    <HowItWorks />
    <Pricing />
    <Contact />
    <FAQ />
    <Footer />
  </div>
</template>

<style scoped>
.dark {
  @apply bg-background text-foreground;
}
</style>
