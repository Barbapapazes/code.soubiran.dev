import type { CodeImageGradient, CodeImageLanguage, CodeImageSize } from '../shared/code-image'
import type { ObservabilityEnvironment } from './observability'

export const codeImageDefaults = {
  code: '',
  language: 'markdown',
  size: 'md',
  gradient: 'purple',
  title: '',
  watermark: '',
} as const

export interface CodeImageInput {
  code?: string
  language?: CodeImageLanguage
  size?: CodeImageSize
  gradient?: CodeImageGradient
  title?: string
  watermark?: string
}

export interface CodeImageEnvironment extends ObservabilityEnvironment {
  BROWSER_RUN_ACCOUNT_ID: string
  BROWSER_RUN_API_TOKEN: string
}

export interface CodeImage {
  data: string
  mimeType: string
}
