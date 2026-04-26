// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/hints', '@nuxtjs/tailwindcss'],
  components: {
    dirs: [
      { path: '~/components', ignore: ['**/index.ts'], pathPrefix: false }
    ]
  },
  css: ['~/assets/css/globals.css'],
  vite: {
    optimizeDeps: {
      include: ['@vue/devtools-core', '@vue/devtools-kit', 'vue-sonner']
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080/api'
    }
  }
})
