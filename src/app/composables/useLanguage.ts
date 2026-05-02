import type { Language } from '@/app/types/language'
import { params } from '@/app/state/params'

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
