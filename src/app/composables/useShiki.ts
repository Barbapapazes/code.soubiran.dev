import type { HighlighterCore } from 'shiki/core'
import type { CodeImageLanguage } from '@/shared/code-image'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

let highlighter: HighlighterCore | null = null

export async function useShiki(code: MaybeRefOrGetter<string>, lang: MaybeRefOrGetter<CodeImageLanguage>) {
  if (!highlighter) {
    highlighter = await createHighlighterCore({
      themes: [
        import('@shikijs/themes/github-dark'),
        import('@shikijs/themes/github-light'),
      ],
      langs: [
        import('@shikijs/langs/vue'),
        import('@shikijs/langs/typescript'),
        import('@shikijs/langs/markdown'),
        import('@shikijs/langs/php'),
        import('@shikijs/langs/json'),
        import('@shikijs/langs/html'),
      ],
      engine: createJavaScriptRegexEngine(),
    })
  }

  function codeToHtml(code: string, lang: CodeImageLanguage) {
    return highlighter!.codeToHtml(code, {
      lang,
      themes: {
        dark: 'github-dark',
        light: 'github-light',
      },
      defaultColor: false,
      tabindex: -1,
    })
  }

  const html = computed(() => codeToHtml(toValue(code), toValue(lang)))

  return {
    html,
  }
}
