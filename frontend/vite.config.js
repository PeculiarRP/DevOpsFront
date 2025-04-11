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
        target: 'http://localhost:8585/', // Адрес вашего бэкенда
        changeOrigin: true,
        "pathRewrite": {
              host: true
        },
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})