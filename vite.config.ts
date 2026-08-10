import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  clearScreen: false,
  server: {
    proxy: {
      '/vinted-api': {
        target: 'https://www.vinted.co.uk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/vinted-api/, ''),
      },
    },
  },
})
