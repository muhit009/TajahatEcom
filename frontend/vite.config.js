import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/product': 'http://localhost:8000',
      '/order':   'http://localhost:8000',
      '/ai':      'http://localhost:8000',
      '/images':  'http://localhost:8000',
    },
  },
})
