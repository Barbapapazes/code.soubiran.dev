import { execFileSync } from 'node:child_process'
import { bindings, defineConfig } from 'cf/config'

const release = execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
  cwd: new URL('.', import.meta.url),
  encoding: 'utf8',
}).trim()

export default defineConfig({
  worker: {
    name: 'code-soubiran-dev',
    entrypoint: './worker/index.ts',
    compatibilityDate: '2026-10-07',
    compatibilityFlags: ['nodejs_compat'],
    domains: ['code.soubiran.dev'],
    workersDev: false,
    previewUrls: false,
    assets: {
      notFoundHandling: 'single-page-application',
      runWorkerFirst: ['/mcp'],
    },
    observability: {
      enabled: true,
      logs: {
        enabled: true,
        invocationLogs: false,
      },
      traces: { enabled: true },
    },
    env: {
      ASSETS: bindings.assets(),
      BROWSER_RUN_ACCOUNT_ID: bindings.secret(),
      BROWSER_RUN_API_TOKEN: bindings.secret(),
      SENTRY_DSN: bindings.secret(),
      SENTRY_ENVIRONMENT: bindings.text('production'),
      SENTRY_RELEASE: bindings.text(release),
    },
  },
})
