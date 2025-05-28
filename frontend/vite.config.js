import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    global: true,
    environment: 'jsdom',
    setupFiles: './test/setup.js',
    coverage: {
      provider: 'istanbul',
    }
  },
  server: {
    proxy: {
      '/api': {
        // target: 'http://127.0.0.1:8585', // Адрес вашего бэкенда
        target: 'http://192.168.49.2:8585', // Адрес вашего бэкенда
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
