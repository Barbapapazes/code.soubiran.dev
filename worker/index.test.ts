import type { WorkerEnvironment } from './index'
import { describe, expect, it, vi } from 'vitest'
import worker from './index'
import { handleMcpRequest } from './mcp-handler'

vi.mock('./mcp-handler', () => ({
  handleMcpRequest: { fetch: vi.fn(async () => new Response('MCP')) },
}))

function environment(): WorkerEnvironment {
  return {
    BROWSER_RUN_ACCOUNT_ID: 'account',
    BROWSER_RUN_API_TOKEN: 'secret',
    ASSETS: { fetch: vi.fn(async () => new Response('SPA')) },
  }
}

const context = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as Parameters<typeof worker.fetch>[2]

describe('worker routing', () => {
  it.each(['GET', 'POST', 'DELETE'])('routes MCP %s requests with bindings and execution context', async (method) => {
    const env = environment()
    const request = new Request('https://code.soubiran.dev/mcp?transport=http', { method })

    const response = await worker.fetch(request, env, context)

    expect(await response.text()).toBe('MCP')
    expect(handleMcpRequest.fetch).toHaveBeenLastCalledWith(request, env, context)
    expect(env.ASSETS.fetch).not.toHaveBeenCalled()
  })

  it.each(['/', '/?code=aGVsbG8%3D', '/_nuxt/app.js', '/mcp/other'])('delegates %s to the assets binding', async (path) => {
    const env = environment()
    const request = new Request(`https://code.soubiran.dev${path}`)
    const response = await worker.fetch(request, env, context)

    expect(await response.text()).toBe('SPA')
    expect(env.ASSETS.fetch).toHaveBeenCalledExactlyOnceWith(request)
  })
})
