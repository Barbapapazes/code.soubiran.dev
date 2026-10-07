import type { WorkerExecutionContext } from 'evlog/workers'
import type { CodeImageEnvironment } from './types'
import { createMcpHandler } from 'agents/mcp/server'
import { initWorkersLogger, withEvlog } from 'evlog/workers'
import { createCodeImageMcpServer } from './mcp'
import { correlateRequest, safeWorkerError } from './observability'

const mcpPath = '/mcp'

initWorkersLogger({
  env: { service: 'code.soubiran.dev' },
  redact: true,
  sampling: {
    rates: { info: 10, error: 100, warn: 100 },
    keep: [
      { status: 400 },
      { duration: 1000 },
    ],
  },
})

export const handleMcpRequest = {
  fetch(request: Request, env: CodeImageEnvironment, ctx: WorkerExecutionContext) {
    return withEvlog<CodeImageEnvironment>(
      async (request, env, ctx, log) => {
        if (new URL(request.url).pathname !== mcpPath) {
          return new Response('Not found', { status: 404 })
        }

        const requestId = crypto.randomUUID()
        log.set({
          requestId,
          // Do not retain arbitrary caller-supplied correlation headers.
          traceparent: undefined,
          ...correlateRequest(requestId),
          environment: env.SENTRY_ENVIRONMENT ?? 'development',
          version: env.SENTRY_RELEASE,
          mcp: { endpoint: 'mcp' },
        })

        const handler = createMcpHandler(
          () => createCodeImageMcpServer(env, log),
          {
            route: mcpPath,
            allowedHostnames: ['code.soubiran.dev', 'localhost', '127.0.0.1'],
            allowedOriginHostnames: ['code.soubiran.dev', 'localhost', '127.0.0.1'],
            corsOptions: {
              origin: 'https://code.soubiran.dev',
            },
          },
        )

        try {
          const response = await handler(request, env, ctx as Parameters<typeof handler>[2])
          if (response.status >= 400) {
            log.setLevel(response.status >= 500 ? 'error' : 'warn')
          }
          return response
        }
        catch (error) {
          // Both evlog and the outer Sentry wrapper see only the safe exception.
          throw safeWorkerError(error)
        }
      },
      {
        include: [mcpPath],
      },
    ).fetch(request, env, ctx)
  },
}
