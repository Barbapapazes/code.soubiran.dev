import soubiran from '@soubiran/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    soubiran({
      title: 'QR',
      hostname: 'qr.soubiran.dev',
      markdown: false,
      ssg: false,
      api: false,
      meta: false,
      router: false,
      sitemap: false,
    }),
  ],
})
