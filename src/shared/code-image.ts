export const codeImageSelector = '[data-code-image]'

export const codeImageLanguageValues = ['typescript', 'markdown', 'php', 'json', 'vue', 'html'] as const
export type CodeImageLanguage = typeof codeImageLanguageValues[number]

export const codeImageSizeValues = ['sm', 'md', 'lg', 'xl'] as const
export type CodeImageSize = typeof codeImageSizeValues[number]

export const codeImageGradientValues = [
  'purple',
  'blue',
  'green',
  'orange',
  'pink',
  'red',
  'sunset',
  'midnight',
  'aurora',
  'lagoon',
] as const
export type CodeImageGradient = typeof codeImageGradientValues[number]
