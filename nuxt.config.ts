import { cloudflare } from '@cloudflare/vite-plugin'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-07',
  ssr: false,
  pages: false,
  devtools: { enabled: false },
  server: { builder: 'vite' },
  modules: ['@nuxt/ui', '@vueuse/nuxt', '@nuxt/scripts'],
  css: ['~/styles/main.css'],
  ui: { fonts: false, colorMode: false },
  // Bundle icons found in source locally; use Iconify for any dynamic fallback.
  icon: { provider: 'iconify', serverBundle: false, clientBundle: { scan: true } },
  imports: {
    imports: [{ from: 'tailwind-variants', name: 'tv' }],
  },
  scripts: {
    registry: {
      umamiAnalytics: {
        hostUrl: 'https://umami.soubiran.dev',
        websiteId: '09e30994-a21c-4c4f-b79a-7b42273fe98c',
        autoTrack: false,
        beforeSend: '__codeAnalyticsBeforeSend',
        scriptInput: { src: 'https://umami.soubiran.dev/script.js' },
        trigger: 'onNuxtReady',
      },
    },
  },
  $development: {
    scripts: {
      registry: {
        umamiAnalytics: 'mock',
      },
    },
  },
  app: {
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
    },
  },
  vite: {
    plugins: [
      cloudflare({
        viteEnvironment: { name: 'worker' },
      }),
    ],
  },
  typescript: {
    strict: true,
    tsConfig: {
      compilerOptions: {
        types: ['webmcp-types', 'dom-chromium-ai'],
      },
    },
  },
})
