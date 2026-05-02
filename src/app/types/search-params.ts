import type { Gradient } from '@/app/types/gradient'
import type { Language } from '@/app/types/language'
import type { Size } from '@/app/types/size'

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
