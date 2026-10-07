import type { CodeImageEnvironment } from './types'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { handleMcpRequest } from './mcp-handler'

const { handler } = vi.hoisted(() => ({
  handler: vi.fn(async () => new Response('Unavailable', { status: 503 })),
}))

vi.mock('agents/mcp/server', () => ({ createMcpHandler: () => handler }))
vi.mock('./mcp', () => ({ createCodeImageMcpServer: vi.fn() }))

const env: CodeImageEnvironment = {
  BROWSER_RUN_ACCOUNT_ID: 'account',
  BROWSER_RUN_API_TOKEN: 'secret',
  SENTRY_DSN: 'https://key@example.com/1',
  SENTRY_ENVIRONMENT: 'production',
  SENTRY_RELEASE: 'commit',
}

describe('mCP request logging', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected telemetry request'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([env.SENTRY_DSN, undefined])('keeps logs in Cloudflare with SENTRY_DSN=%s without sending payloads', async (dsn) => {
    const tasks: Promise<unknown>[] = []
    const ctx = { waitUntil: vi.fn((task: Promise<unknown>) => tasks.push(task)) }
    const response = await handleMcpRequest.fetch(new Request('https://code.soubiran.dev/mcp?code=private-content', {
      method: 'POST',
      body: 'private content',
      headers: { 'x-request-id': 'private content' },
    }), { ...env, SENTRY_DSN: dsn }, ctx)
    await response.text()
    await Promise.all(tasks)

    expect(console.error).toHaveBeenCalledOnce()
    expect(console.error).toHaveBeenCalledWith(expect.objectContaining({
      status: 503,
      level: 'error',
      environment: 'production',
      version: 'commit',
    }))
    const output = JSON.stringify(vi.mocked(console.error).mock.calls)
    expect(output).not.toContain('private')
    expect(output).not.toContain('secret')
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('sanitizes unexpected transport failures before evlog and Sentry see them', async () => {
    handler.mockRejectedValueOnce(new Error('private content'))
    const tasks: Promise<unknown>[] = []
    await expect(handleMcpRequest.fetch(new Request('https://localhost/mcp'), env, {
      waitUntil: task => tasks.push(task),
    })).rejects.toThrow('Worker operation failed')
    await Promise.all(tasks)
    expect(console.error).toHaveBeenCalledOnce()
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain('private')
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })
})
