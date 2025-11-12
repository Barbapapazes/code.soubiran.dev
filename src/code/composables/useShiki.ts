import type { Language } from '@/code/types/language'
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

let highlighter: HighlighterCore | null = null

export async function useShiki(code: MaybeRefOrGetter<string>, lang: MaybeRefOrGetter<Language>) {
  if (!highlighter) {
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
        import('@shikijs/langs/vue'),
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
