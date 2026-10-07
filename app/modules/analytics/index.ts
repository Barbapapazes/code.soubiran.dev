import type { ModuleDependencies } from 'nuxt/schema'
import { addImports, addPlugin, createResolver, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: { name: 'code:analytics' },
  // Provide defaults before Nuxt Scripts initializes its registry and runtime config.
  moduleDependencies: (nuxt): ModuleDependencies => ({
    '@nuxt/scripts': {
      defaults: {
        registry: {
          umamiAnalytics: nuxt.options.dev
            ? 'mock'
            : {
                hostUrl: 'https://umami.soubiran.dev',
                websiteId: '09e30994-a21c-4c4f-b79a-7b42273fe98c',
                autoTrack: false,
                beforeSend: '__codeAnalyticsBeforeSend',
                scriptInput: { src: 'https://umami.soubiran.dev/script.js' },
                trigger: 'onNuxtReady',
              },
        },
      },
    },
  }),
  setup() {
    const resolver = createResolver(import.meta.url)

    addImports({ name: 'useAnalytics', from: resolver.resolve('runtime/composables/useAnalytics') })
    addPlugin({ src: resolver.resolve('runtime/plugins/analytics.client'), mode: 'client' })
  },
})
