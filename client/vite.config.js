import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Ensure assets are loaded from the root in production
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  }
})
