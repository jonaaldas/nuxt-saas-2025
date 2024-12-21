// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@unlok-co/nuxt-stripe",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "nuxt-auth-utils",
    "nuxt-resend",
  ],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
    storageKey: "color-mode",
  },
  ssr: false,
  routeRules: {
    "/blog/**": { ssr: true },
  },
});
