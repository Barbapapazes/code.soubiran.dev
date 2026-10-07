import { addComponent, addImports, createResolver, defineNuxtModule } from 'nuxt/kit'

export default defineNuxtModule({
  meta: { name: 'code:editor' },
  moduleDependencies: {
    '@nuxt/ui': {},
    '@vueuse/nuxt': {},
    './app/modules/analytics': {},
  },
  setup(_, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.css.push(resolver.resolve('runtime/styles/shiki.css'))
    addImports({ name: 'useEditor', from: resolver.resolve('runtime/composables/useEditor') })
    addComponent({ name: 'EditorWorkspace', filePath: resolver.resolve('runtime/components/EditorWorkspace.vue') })
  },
})
