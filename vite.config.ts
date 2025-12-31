import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const siteUrl = 'https://junkato.jp'
process.env.VITE_SITE_URL = siteUrl

export default defineConfig({
  plugins: [react()],
  base: '/tashihiki/',
  define: {
    __SITE_URL__: JSON.stringify(siteUrl),
  },
})
