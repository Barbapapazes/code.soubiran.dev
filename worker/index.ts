import type { CodeImageEnvironment } from './types'
import { handleMcpRequest } from './mcp-handler'

export interface WorkerEnvironment extends CodeImageEnvironment {
  ASSETS: { fetch: (request: Request) => Promise<Response> }
}

export default {
  fetch(request: Request, env: WorkerEnvironment, ctx: Parameters<typeof handleMcpRequest.fetch>[2]) {
    if (new URL(request.url).pathname === '/mcp') {
      return handleMcpRequest.fetch(request, env, ctx)
    }

    return env.ASSETS.fetch(request)
  },
}
