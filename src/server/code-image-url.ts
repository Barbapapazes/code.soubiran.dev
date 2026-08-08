import type { CodeImageInput } from '@/server/types'
import { codeImageDefaults } from '@/server/types'
import { base64Encode } from '@/shared/base64'

const appUrl = 'https://code.soubiran.dev'

export function createCodeImageUrl(input: CodeImageInput): URL {
  const url = new URL(appUrl)
  const options = { ...codeImageDefaults, ...input }

  if (options.code) {
    url.searchParams.set('code', base64Encode(options.code))
  }
  if (options.language !== codeImageDefaults.language) {
    url.searchParams.set('language', options.language)
  }
  if (options.size !== codeImageDefaults.size) {
    url.searchParams.set('size', options.size)
  }
  if (options.gradient !== codeImageDefaults.gradient) {
    url.searchParams.set('gradient', options.gradient)
  }
  if (options.title) {
    url.searchParams.set('title', options.title)
  }
  if (options.watermark) {
    url.searchParams.set('watermark', options.watermark)
  }

  return url
}
