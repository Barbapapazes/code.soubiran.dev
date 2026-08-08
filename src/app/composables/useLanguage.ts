import type { Language } from '@/app/types/language'
import { params } from '@/app/state/params'

const language = ref<Language>('markdown')
const languages = [
  { label: 'HTML', value: 'html' },
  { label: 'JSON', value: 'json' },
  { label: 'Markdown', value: 'markdown' },
  { label: 'PHP', value: 'php' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Vue', value: 'vue' },
] satisfies { label: string, value: Language }[]

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
