import type { CloudflareOptions } from '@sentry/cloudflare'
import { captureException, getActiveSpan, getCurrentScope } from '@sentry/cloudflare'
import { BrowserRunError } from './errors'

export interface ObservabilityEnvironment {
  SENTRY_DSN?: string
  SENTRY_ENVIRONMENT?: string
  SENTRY_RELEASE?: string
}

export function sentryOptions(env: ObservabilityEnvironment): CloudflareOptions {
  return {
    dsn: env.SENTRY_DSN,
    enabled: Boolean(env.SENTRY_DSN),
    environment: env.SENTRY_ENVIRONMENT ?? 'development',
    release: env.SENTRY_RELEASE,
    // Logs belong exclusively in Cloudflare, not Sentry.
    beforeSendLog: () => null,
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
    // evlog owns logs; console breadcrumbs would duplicate them and can carry content.
    integrations: defaults => defaults.filter(integration => integration.name !== 'Console'),
    beforeSend(event) {
      event.message = undefined
      event.request = undefined
      event.user = undefined
      event.breadcrumbs = undefined
      event.extra = undefined
      event.tags = Object.fromEntries(Object.entries(event.tags ?? {}).filter(([key]) =>
        ['operation', 'request_id', 'browser_run_status'].includes(key),
      ))
      event.transaction = 'Worker request'
      event.contexts = { trace: event.contexts?.trace }
      for (const exception of event.exception?.values ?? []) {
        exception.value = 'Worker operation failed'
      }
      return event
    },
    beforeSendSpan(span) {
      // MCP IDs, client metadata and outgoing URLs are caller-controlled or sensitive.
      const allowed = new Set([
        'sentry.op',
        'sentry.origin',
        'sentry.kind',
        'sentry.sample_rate',
        'sentry.segment.id',
        'sentry.trace.lifecycle',
        'sentry.environment',
        'sentry.release',
        'sentry.sdk.name',
        'sentry.sdk.version',
        'http.request.method',
        'http.response.status_code',
        'mcp.tool.result.is_error',
        'mcp.tool.result.content_count',
      ])
      const isTool = span.attributes['mcp.tool.name'] === 'generate_code_image'
      span.attributes = Object.fromEntries(Object.entries(span.attributes).filter(([key]) => allowed.has(key)))
      if (isTool) {
        span.attributes['mcp.tool.name'] = 'generate_code_image'
        span.attributes['mcp.method.name'] = 'tools/call'
      }
      span.name = isTool ? 'tools/call generate_code_image' : span.is_segment ? 'Worker request' : 'Worker operation'
      span.attributes['sentry.segment.name'] = 'Worker request'
      span.links = undefined
      return span
    },
  }
}

export function correlateRequest(requestId: unknown) {
  const trace = getActiveSpan()?.spanContext()
  if (typeof requestId === 'string') {
    getCurrentScope().setTag('request_id', requestId)
  }
  return trace ? { traceId: trace.traceId, spanId: trace.spanId } : {}
}

export function safeWorkerError(error: unknown): Error {
  const safe = new Error(error instanceof BrowserRunError
    ? `Browser Run could not generate the code image (${error.status})`
    : 'Worker operation failed')
  safe.name = error instanceof BrowserRunError ? 'BrowserRunError' : 'WorkerError'
  // Preserve call sites, not messages or causes (which may contain submitted content).
  if (error instanceof Error && error.stack) {
    safe.stack = `${safe.name}: ${safe.message}\n${error.stack.split('\n').filter(line => /^\s+at /.test(line)).join('\n')}`
  }
  return safe
}

export function reportWorkerError(error: unknown, operation: string): Error {
  const safe = safeWorkerError(error)
  captureException(safe, {
    tags: {
      operation,
      ...(error instanceof BrowserRunError ? { browser_run_status: String(error.status) } : {}),
    },
  })
  return safe
}
