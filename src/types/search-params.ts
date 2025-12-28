import type { Gradient } from '@/types/gradient'
import type { Language } from '@/types/language'
import type { Size } from '@/types/size'

export interface SearchParams {
  /**
   * Content to highlight. Base64 encoded.
   */
  code?: string
  /**
   * Language of the code block.
   */
  language?: Language
  /**
   * Size of the code block.
   */
  size?: Size
  /**
   * Watermark text to display under the code block.
   */
  watermark?: string
  /**
   * Background gradient to use.
   */
  gradient?: Gradient
  /**
   * Title to display at the top of the code block.
   */
  title?: string
}
