import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import path

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { // Add resolve configuration
    alias: {
      '@': path.resolve(__dirname, './src'), // Define @ alias
    },
  },
  define: {
    'process.env': {
      SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      SUPABASE_SERVICE_KEY: process.env.VITE_SUPABASE_SERVICE_KEY,
      SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
    }
  }
})
