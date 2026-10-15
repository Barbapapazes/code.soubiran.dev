import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite-plus'

// Nuxt owns the app build configuration in nuxt.config.ts.
// This config is for Vite+ checks and the standalone unit tests.
export default defineConfig({
  fmt: {
    semi: false,
    singleQuote: true,
    printWidth: 120,
    ignorePatterns: ['.agents/**', '.pi/**', 'skills-lock.json', 'patches/**'],
  },
  lint: {
    plugins: ['typescript', 'unicorn', 'oxc', 'import', 'vue', 'vitest'],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    // Keep Vue SFC and Nuxt-generated type checking in `nuxt typecheck`.
    options: { typeAware: false, typeCheck: false },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    ignorePatterns: ['.nuxt/**', '.output/**', '.cloudflare/**', '.wrangler/**', 'dist/**'],
  },
  test: { maxWorkers: 1, fileParallelism: false },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
    },
  },
})
