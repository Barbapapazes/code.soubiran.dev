import { addComponent, createResolver, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: { name: 'code:assistant' },
  moduleDependencies: {
    '@nuxt/ui': {},
    './app/modules/analytics': {},
  },
  setup() {
    const resolver = createResolver(import.meta.url)

    for (const name of ['AssistantToggle', 'AssistantPanel']) {
      addComponent({ name, filePath: resolver.resolve(`runtime/components/${name}.vue`) })
    }
  },
})
