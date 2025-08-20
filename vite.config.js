import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: 'crypto-js',
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.DOCKER_ENV === 'true' ? 'http://localhost:3000' : 'http://backend:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
