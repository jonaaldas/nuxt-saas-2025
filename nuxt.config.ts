// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@unlok-co/nuxt-stripe", "shadcn-nuxt", "@nuxtjs/color-mode"],
  ssr: false,
  routeRules: {
    "/blog/**": { ssr: true },
  },
  colorMode: {
    preference: "system",
    fallback: "light",
    hid: "nuxt-color-mode-script",
    globalName: "__NUXT_COLOR_MODE__",
    componentName: "ColorScheme",
    classPrefix: "",
    storage: "localStorage",
    storageKey: "nuxt-color-mode",
  },
});
