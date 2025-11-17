import type { HighlighterCore } from 'shiki/core'
import type { Language } from '@/types/language'
import vue from '@shikijs/langs/vue'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import vuePHP from '../tm-grammars/vue-php.json'

let highlighter: HighlighterCore | null = null

export async function useShiki(code: MaybeRefOrGetter<string>, lang: MaybeRefOrGetter<Language>) {
  if (!highlighter) {
    const _vueLang = vue.at(-1)
    const vueLang = Object.assign({}, _vueLang)

    delete vueLang.embeddedLangsLazy
    delete vueLang.embeddedLangs

    highlighter = await createHighlighterCore({
      themes: [
        import('@shikijs/themes/github-dark'),
        import('@shikijs/themes/github-light'),
      ],
      langs: [
        import('@shikijs/langs/typescript'),
        import('@shikijs/langs/markdown'),
        import('@shikijs/langs/php'),
        import('@shikijs/langs/json'),
        import('@shikijs/langs/html'),
        import('@shikijs/langs/html-derivative'),
        import('@shikijs/langs/markdown-vue'),
        import('@shikijs/langs/vue-directives'),
        import('@shikijs/langs/vue-interpolations'),
        import('@shikijs/langs/vue-sfc-style-variable-injection'),
        vueLang,
        vuePHP,
      ],
      engine: createJavaScriptRegexEngine(),
    })
  }

  function codeToHtml(code: string, lang: Language) {
    return highlighter!.codeToHtml(code, {
      lang,
      themes: {
        dark: 'github-dark',
        light: 'github-light',
      },
      defaultColor: false,
    })
  }

  const html = computed(() => codeToHtml(toValue(code), toValue(lang)))

  return {
    html,
  }
}
