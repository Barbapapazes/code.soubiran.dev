import type { CodeImageEnvironment } from '@/server/types'
import { createMcpHandler } from 'agents/mcp/server'
import { initWorkersLogger, withEvlog } from 'evlog/workers'
import { createCodeImageMcpServer } from '@/server/mcp'

const mcpPath = '/mcp'

initWorkersLogger({
  env: { service: 'code.soubiran.dev' },
  redact: true,
  sampling: {
    rates: { info: 10 },
    keep: [
      { status: 400 },
      { duration: 1000 },
    ],
  },
  stringify: false,
})

export default withEvlog<CodeImageEnvironment>(
  (request, env, ctx, log) => {
    if (new URL(request.url).pathname !== mcpPath) {
      return new Response('Not found', { status: 404 })
    }

    log.set({ mcp: { endpoint: 'mcp' } })

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

    return handler(request, env, ctx as Parameters<typeof handler>[2])
  },
  { include: [mcpPath] },
)
