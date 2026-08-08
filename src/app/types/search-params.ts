import type { Gradient } from '@/app/types/gradient'
import type {
  CodeImageLanguage,
  CodeImageSize,
} from '@/shared/code-image'

export interface SearchParams {
  /**
   * Content to highlight. Base64 encoded.
   */
  code?: string
  /**
   * Language of the code block.
   */
  language?: CodeImageLanguage
  /**
   * Size of the code block.
   */
  size?: CodeImageSize
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
