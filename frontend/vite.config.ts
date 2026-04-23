import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In Docker, the backend is reachable via the service name.
// Set API_TARGET=http://backend:8000 in the container environment.
const API_TARGET = process.env.API_TARGET ?? 'http://localhost:8000'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
})
