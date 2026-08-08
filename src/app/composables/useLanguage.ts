import type { CodeImageLanguage } from '@/shared/code-image'
import { params } from '@/app/state/params'

const language = ref<CodeImageLanguage>('markdown')
const languages = [
  { label: 'HTML', value: 'html' },
  { label: 'JSON', value: 'json' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'PHP', value: 'php' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Vue', value: 'vue' },
] satisfies { label: string, value: CodeImageLanguage }[]

export function useLanguage() {
  language.value = params.language || 'markdown'

  watch(language, () => {
    params.language = language.value || undefined
  })

  return {
    language,
    languages,
  }
}
