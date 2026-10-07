import type { CodeImageEnvironment } from './types'
import { withSentry } from '@sentry/cloudflare'
import { handleMcpRequest } from './mcp-handler'
import { sentryOptions } from './observability'

export interface WorkerEnvironment extends CodeImageEnvironment {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

export default withSentry(sentryOptions, {
  fetch(request: Request, env: WorkerEnvironment, ctx: Parameters<typeof handleMcpRequest.fetch>[2]) {
    if (new URL(request.url).pathname === '/mcp') {
      return handleMcpRequest.fetch(request, env, ctx)
    }

    return env.ASSETS.fetch(request)
  },
})
