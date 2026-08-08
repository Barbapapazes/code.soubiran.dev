import { describe, expect, it, vi } from 'vitest'

const { initWorkersLogger, withEvlog } = vi.hoisted(() => ({
  initWorkersLogger: vi.fn(),
  withEvlog: vi.fn(),
}))

vi.mock('evlog/workers', () => ({
  initWorkersLogger,
  withEvlog,
}))

describe('server logging', () => {
  it('samples routine requests while retaining failures and slow requests', async () => {
    await import('@/server/index')

    expect(initWorkersLogger).toHaveBeenCalledWith({
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
  })
})
