// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  typescript: {
    typeCheck: true
  },
  nitro: {
    experimental: {
      websocket: true
    }
  },
  routeRules: {
    '/api/**': { cors: true, headers: { 'access-control-allow-methods': 'GET' } },
  },
})
