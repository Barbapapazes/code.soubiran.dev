import { addImports, createResolver, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: { name: 'code:webmcp' },
  setup() {
    const resolver = createResolver(import.meta.url)

    addImports([
      { name: 'useWebMCP', from: resolver.resolve('runtime/composables/useWebMCP') },
      { name: 'createWebMCPClient', from: resolver.resolve('runtime/utils/createWebMCPClient') },
    ])
  },
})
