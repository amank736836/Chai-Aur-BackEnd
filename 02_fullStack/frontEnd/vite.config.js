import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  index : {
    proxy : {
      '/api' : 'http://localhost:5000'
    }
  }
})
