import { describe, expect, it } from 'vitest'
import { createCodeImageUrl } from '@/server/code-image-url'
import { base64Decode } from '@/shared/base64'

describe('createCodeImageUrl', () => {
  it('omits default values from the canonical app URL', () => {
    expect(createCodeImageUrl({}).toString()).toBe('https://code.soubiran.dev/')
  })

  it('uses the same query values as the user-facing editor', () => {
    const url = createCodeImageUrl({
      code: 'const greeting = "👋"',
      language: 'typescript',
      size: 'xl',
      gradient: 'orange',
      title: 'Hello',
      watermark: 'code.soubiran.dev',
    })

    expect(base64Decode(url.searchParams.get('code')!)).toBe('const greeting = "👋"')
    expect(url.searchParams.get('language')).toBe('typescript')
    expect(url.searchParams.get('size')).toBe('xl')
    expect(url.searchParams.get('gradient')).toBe('orange')
    expect(url.searchParams.get('title')).toBe('Hello')
    expect(url.searchParams.get('watermark')).toBe('code.soubiran.dev')
  })
})
