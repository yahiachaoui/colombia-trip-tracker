import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base configurable pour GitHub Pages (sous-chemin /colombia-trip-tracker/).
  // Reste à '/' en local, Vercel et Netlify.
  base: process.env.VITE_BASE || '/',
})
