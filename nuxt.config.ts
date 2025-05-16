// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  components: true,
  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL || 'http://127.0.0.1:8000/api', 
    }
  },
  modules: [
    '@ant-design-vue/nuxt'
  ],
  vite: {
    server: {
      watch: {
        usePolling: true
      },
      hmr: {
        port: 24678
      }
    }
  },
  build: {
    transpile: ['@ant-design/icons-vue']
  },
})