// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // TypeScript strict mode
  typescript: {
    strict: true,
    typeCheck: false, // Disabled - install vue-tsc for type checking
  },

  // Modules
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],

  // TailwindCSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js',
  },

  // Pinia configuration
  pinia: {
    storesDirs: ['./app/stores/**'],
  },

  // App configuration
  srcDir: 'app',
  app: {
    head: {
      title: 'COVID-19 Dashboard',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Real-time COVID-19 statistics dashboard' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  // Build configuration
  build: {
    transpile: ['vue3-apexcharts', 'apexcharts'],
  },
});
