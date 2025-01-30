import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Tailwind from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Fonts from 'unplugin-fonts/vite'

export default defineConfig({
  plugins: [
    Vue(),
    Tailwind(),

    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        {
          from: 'tailwind-variants',
          imports: ['tv'],
        },
      ],
      dirs: ['./src/**/composables', './src/**/utils'],
      dts: './src/auto-imports.d.ts',
      viteOptimizeDeps: true,
    }),
    Components({
      dirs: ['./src/**/components'],
      dts: './src/components.d.ts',
    }),

    Fonts({
      google: {
        families: [
          {
            name: 'DM Sans',
            styles: 'ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000',
          },
          {
            name: 'DM Mono',
            styles: 'ital,wght@0,300;0,400;0,500;1,300;1,400;1,500',
          },
          {
            name: 'Sofia Sans',
            styles: 'ital,wght@0,1..1000;1,1..1000',
          },
        ],
      },
    }),

    VueDevTools(),
  ],

  optimizeDeps: {
    include: [
      'defu',
      'ohash',
      'reka-ui',
      'shiki/core',
      'tailwind-variants',
      'modern-screenshot',
      'shiki/engine/javascript',
      '@shikijs/langs/markdown',
      '@shikijs/langs/typescript',
      '@shikijs/themes/github-dark',
      '@shikijs/themes/github-light',
    ],
  },

  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },

})
