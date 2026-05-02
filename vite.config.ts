import soubiran from '@soubiran/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    soubiran({
      title: 'Code',
      hostname: 'code.soubiran.dev',
      markdown: false,
      ssg: false,
      api: false,
      meta: false,
      router: false,
      sitemap: false,
    }),
  ],
})
