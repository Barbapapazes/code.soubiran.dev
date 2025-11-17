import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import fonts from 'unplugin-fonts/vite'
import icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),

    ui({
      ui: {
        colors: {
          neutral: 'neutral',
        },
      },
      components: {
        dts: './src/components.d.ts',
      },
      autoImport: {
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
      },
    }),

    icons({
      autoInstall: true,
    }),

    fonts({
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
  ],

  optimizeDeps: {
    include: [
      'defu',
      'shiki/core',
      'modern-screenshot',
      'shiki/engine/javascript',
      '@shikijs/themes/github-light',
      '@shikijs/themes/github-dark',
      '@shikijs/langs/markdown',
      '@shikijs/langs/typescript',
      '@shikijs/langs/vue',
      '@shikijs/langs/php',
      '@shikijs/langs/json',
      '@shikijs/langs/html',
    ],
  },

  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },

})
