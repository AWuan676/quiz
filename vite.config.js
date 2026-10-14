import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages serves the site under /<repo-name>/; the deploy workflow sets BASE_PATH.
  base: process.env.BASE_PATH || '/',
  // host: true exposes the dev server on your LAN so a phone can open the QR link.
  server: { host: true, port: 5173 },
})
