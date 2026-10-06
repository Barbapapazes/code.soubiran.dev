import { fileURLToPath } from 'node:url'
import { cloudflare } from '@cloudflare/vite-plugin'
import icons from 'unplugin-icons/vite'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-15',
  ssr: false,
  pages: false,
  devtools: { enabled: false },
  server: { builder: 'vite' },
  modules: ['@nuxt/ui', '@vueuse/nuxt'],
  css: ['~/styles/main.css'],
  ui: { fonts: false, colorMode: false },
  // There is no Nuxt server runtime: resolve dynamic icons with Iconify,
  // and bundle the editor's explicit icons with unplugin-icons below.
  icon: { provider: 'iconify', serverBundle: false },
  imports: {
    imports: [{ from: 'tailwind-variants', name: 'tv' }],
  },
  app: {
    rootAttrs: { class: 'isolate' },
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Code ・ Estéban Soubiran',
      meta: [{ name: 'description', content: 'Generate downloadable code snippets with syntax highlighting.' }],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Sofia+Sans:ital,wght@0,1..1000;1,1..1000&display=swap',
        },
      ],
      script: [{ 'src': 'https://umami.soubiran.dev/script.js', 'defer': true, 'data-website-id': '09e30994-a21c-4c4f-b79a-7b42273fe98c' }],
    },
  },
  vite: {
    plugins: [
      cloudflare({ configPath: fileURLToPath(new URL('./wrangler.jsonc', import.meta.url)) }),
      icons({ compiler: 'vue3' }),
    ],
  },
  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        types: ['unplugin-icons/types/vue', 'webmcp-types', 'dom-chromium-ai'],
      },
    },
  },
})
