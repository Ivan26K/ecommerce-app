import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // ✅ КЛЮЧОВИЙ ФІКС: Base Path повинен дорівнювати назві репозиторію, оточеній слешами
  base: '/vue-ecommerce-app/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
