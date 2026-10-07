import { describe, expect, it } from 'vitest'
import { sanitizeAnalyticsPayload } from './analytics'

describe('sanitizeAnalyticsPayload', () => {
  it.each(['event', 'identify'])('removes sensitive URL state from %s payloads', (type) => {
    const payload = {
      url: '/?code=secret-code&title=private-title&watermark=private-name#secret',
      referrer: 'https://code.soubiran.dev/?code=other-secret#private',
      title: 'private-title',
      name: 'editor_language_change',
      data: { language: 'typescript' },
    }

    expect(sanitizeAnalyticsPayload(type, payload)).toEqual({
      url: '/',
      referrer: 'https://code.soubiran.dev/',
      title: 'Code ・ Estéban Soubiran',
      name: 'editor_language_change',
      data: { language: 'typescript' },
    })
    expect(payload.url).toContain('secret-code')
  })

  it('preserves clean paths and handles missing referrers', () => {
    expect(sanitizeAnalyticsPayload('event', { url: '/' })).toEqual({
      url: '/',
      referrer: '',
      title: 'Code ・ Estéban Soubiran',
    })
  })

  it('strips fragments even without query parameters', () => {
    expect(sanitizeAnalyticsPayload('event', {
      url: '/#private',
      referrer: 'https://example.com/#secret',
    })).toMatchObject({ url: '/', referrer: 'https://example.com/' })
  })
})
