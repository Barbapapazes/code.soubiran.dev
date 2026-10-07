import type { CloudflareOptions, ErrorEvent } from '@sentry/cloudflare'
import { captureException } from '@sentry/cloudflare'
import { describe, expect, it, vi } from 'vitest'
import { BrowserRunError } from './errors'
import { reportWorkerError, safeWorkerError, sentryOptions } from './observability'

vi.mock('@sentry/cloudflare', async importOriginal => ({
  ...await importOriginal<typeof import('@sentry/cloudflare')>(),
  captureException: vi.fn(),
}))

describe('worker observability', () => {
  it('disables Sentry without a DSN and configures privacy and sampling with bindings', () => {
    expect(sentryOptions({}).enabled).toBe(false)
    expect(sentryOptions({}).beforeSendLog!({
      level: 'info',
      message: 'Worker log',
      attributes: {},
    })).toBeNull()
    const options = sentryOptions({ SENTRY_DSN: 'dsn', SENTRY_ENVIRONMENT: 'production', SENTRY_RELEASE: 'commit' })
    expect(options).toMatchObject({
      dsn: 'dsn',
      enabled: true,
      environment: 'production',
      release: 'commit',
      sampleRate: 1,
      tracesSampleRate: 0.1,
      tracePropagationTargets: [],
      dataCollection: {
        userInfo: false,
        cookies: false,
        httpHeaders: false,
        httpBodies: [],
        urlQueryParams: false,
        genAI: { inputs: false, outputs: false },
        stackFrameVariables: false,
        frameContextLines: 0,
      },
    })
  })

  it('removes sensitive context and messages before sending errors', async () => {
    const event: ErrorEvent = {
      type: undefined,
      message: 'private content',
      transaction: '/?code=private-content',
      request: { url: 'https://example.com/?code=private-content', data: 'private content' },
      breadcrumbs: [{ message: 'private content' }],
      user: { ip_address: '127.0.0.1' },
      extra: { code: 'private content' },
      contexts: { mcp: { input: 'private content' } },
      tags: { operation: 'generate_code_image', client: 'private content' },
      exception: { values: [{ type: 'Error', value: 'private content', stacktrace: { frames: [{ filename: 'worker/index.ts', lineno: 1 }] } }] },
    }
    const result = await sentryOptions({}).beforeSend!(event, {})
    expect(JSON.stringify(result)).not.toContain('private')
    expect(result?.exception?.values?.[0]?.stacktrace?.frames?.[0]?.filename).toBe('worker/index.ts')
    expect(result?.tags).toEqual({ operation: 'generate_code_image' })
  })

  it('retains tool identity and outcome but strips payloads, IDs and URLs from spans', () => {
    const span: Parameters<NonNullable<CloudflareOptions['beforeSendSpan']>>[0] = {
      trace_id: 'trace',
      span_id: 'span',
      name: 'private content',
      start_timestamp: 1,
      end_timestamp: 2,
      status: 'error',
      is_segment: true,
      attributes: {
        'sentry.op': 'mcp.server',
        'sentry.environment': 'production',
        'mcp.tool.name': 'generate_code_image',
        'mcp.tool.result.is_error': true,
        'mcp.request.argument.code': 'private content',
        'mcp.tool.result.content': 'private content',
        'mcp.request.id': 'private content',
        'http.url': 'https://example.com/?code=private-content',
        'sentry.segment.name': 'private content',
      },
      links: [{ trace_id: 'trace', span_id: 'span', attributes: { code: 'private content' } }],
    }
    const result = sentryOptions({}).beforeSendSpan!(span)
    expect(JSON.stringify(result)).not.toContain('private')
    expect(result.name).toBe('tools/call generate_code_image')
    expect(result.attributes['mcp.tool.result.is_error']).toBe(true)
    expect(result.attributes['sentry.environment']).toBe('production')
  })

  it('reports handled failures with safe status and preserves only stack call sites', () => {
    const error = new BrowserRunError(503, 'private content\nprivate second line')
    const safe = reportWorkerError(error, 'generate_code_image')
    expect(safe.message).toContain('503')
    expect(safe.stack).not.toContain('private')
    expect(safe.stack).toContain('observability.test.ts')
    expect(captureException).toHaveBeenCalledExactlyOnceWith(safe, {
      tags: { operation: 'generate_code_image', browser_run_status: '503' },
    })
    expect(safeWorkerError('private content').message).toBe('Worker operation failed')
    expect(safeWorkerError(new Error('private content')).message).toBe('Worker operation failed')
  })
})
