import type { CodeImageEnvironment } from '@/server/types'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { generateCodeImage } from '@/server/code-image-screenshot'

const env: CodeImageEnvironment = {
  BROWSER_RUN_ACCOUNT_ID: 'account-id',
  BROWSER_RUN_API_TOKEN: 'secret-token',
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('generateCodeImage', () => {
  it('calls Kitesurf and returns an MCP-ready PNG payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(Uint8Array.from([137, 80, 78, 71]), {
      headers: { 'content-type': 'image/png' },
    }))
    vi.stubGlobal('fetch', fetchMock)

    const image = await generateCodeImage(env, { code: 'export {}' })

    expect(image).toEqual({
      data: 'iVBORw==',
      mimeType: 'image/png',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [endpoint, init] = fetchMock.mock.calls[0] as [URL, RequestInit]
    expect(endpoint.toString()).toBe('https://api.cloudflare.com/client/v4/accounts/account-id/browser-run/screenshot?browser=kitesurf')
    expect(init.headers).toMatchObject({
      'Authorization': 'Bearer secret-token',
      'Content-Type': 'application/json',
    })

    const body = JSON.parse(init.body as string)
    expect(body.url).toBe('https://code.soubiran.dev/?code=ZXhwb3J0IHt9')
    expect(body.selector).toBe('[data-code-image]')
    expect(body.waitForSelector).toMatchObject({
      selector: '[data-code-image]',
      visible: true,
    })
  })

  it('includes the Browser Run error message on failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('sensitive error body', { status: 429 })))

    await expect(generateCodeImage(env, {})).rejects.toThrow('Browser Run could not generate the code image (429): sensitive error body')
  })
})
