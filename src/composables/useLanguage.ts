import type { Language } from '@/types/language'
import { params } from '@/state/params'

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
