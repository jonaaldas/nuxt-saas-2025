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
    "@uploadthing/nuxt",
  ],
  ssr: false,
  uploadthing: {
    routerPath: "~/server/uploadthing.ts",
  },
  runtimeConfig: {
    stripe: {
      key: process.env.NUXT_STRIPE_SECRET_KEY,
    },
    public: {
      stripe: {
        key: process.env.NUXT_STRIPE_PUBLIC_KEY,
      },
    },
  },
  routeRules: {
    "/blog/**": { ssr: true },
  },
});
