import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Tailwind from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'

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
      dirs: ['./src/composables', './src/utils'],
      dts: './src/auto-imports.d.ts',
      viteOptimizeDeps: true,
    }),
    Components({
      dts: './src/components.d.ts',
      dirs: ['./src/components', './src/ui/components'],
    }),

    VueDevTools(),
  ],

  optimizeDeps: {
    include: ['tailwind-variants', 'modern-screenshot', 'shiki/core', 'shiki/engine/javascript', '@shikijs/themes/github-dark', '@shikijs/themes/github-light', '@shikijs/langs/typescript', '@shikijs/langs/markdown', 'reka-ui'],
  },

  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },

})
