import type { Language } from '@/types/language'
import type { Size } from '@/types/size'

export interface SearchParams {
  /**
   * Content to highlight. Base64 encoded.
   */
  code?: string
  language?: Language
  size?: Size
}
