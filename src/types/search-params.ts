import type { Language } from '@/code/types/language'
import type { Size } from '@/code/types/size'

export interface SearchParams {
  /**
   * Content to highlight. Base64 encoded.
   */
  code?: string
  language?: Language
  size?: Size
  watermark?: string
}
