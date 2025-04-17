import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Set base path for GitHub Pages deployment
  base: '/agent-sdk-react', 
  plugins: [react()],
})
