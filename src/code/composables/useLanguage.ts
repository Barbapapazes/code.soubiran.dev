import type { Language } from '@/code/types/language'
import { params } from '@/code/state/params'

const language = ref<Language>('markdown')
export function useLanguage() {
  language.value = params.language || 'markdown'

  watch(language, () => {
    params.language = language.value || undefined
  })

  return {
    language,
  }
}
