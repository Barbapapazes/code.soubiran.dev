import type { Language } from '@/code/types/language'
import type { SearchParams } from '@/code/types/search-params'
import type { Size } from '@/code/types/size'

const defaultSize = 'md'
const size = ref<Size>(defaultSize)

const defaultLanguage = 'markdown'
const language = ref<Language>(defaultLanguage)

const watermark = ref<string | undefined>(undefined)

export function useCode() {
  const params = useUrlSearchParams<SearchParams>('history')

  language.value = params.language || defaultLanguage
  watch(language, () => {
    params.language = language.value
  })

  size.value = params.size || defaultSize
  watch(size, () => {
    params.size = size.value
  })

  const code = ref(base64Decode(params.code || ''))
  watch(code, () => {
    params.code = base64Encode(code.value)
  })

  watermark.value = params.watermark
  watch(watermark, () => {
    params.watermark = watermark.value
  })

  return {
    language,
    size,
    code,
    watermark,
  }
}
