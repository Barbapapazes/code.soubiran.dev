import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useWebMCP } from './useWebMCP'

const tool = { name: 'test', description: 'Test tool', execute: async () => 'done' }

afterEach(() => vi.unstubAllGlobals())

describe('useWebMCP', () => {
  it('registers on navigator and unregisters when the scope is disposed', async () => {
    const registerTool = vi.fn<(tool: WebMCP.ModelContextTool) => void>()
    const unregisterTool = vi.fn()
    vi.stubGlobal('navigator', { modelContext: { registerTool, unregisterTool } })
    vi.stubGlobal('document', {})
    const scope = effectScope()
    const state = scope.run(() => useWebMCP(tool))!
    await Promise.resolve()

    expect(state.isSupported.value).toBe(true)
    expect(state.isRegistered.value).toBe(true)
    expect(registerTool).toHaveBeenCalledWith(expect.objectContaining({ name: 'test' }))
    await expect(registerTool.mock.calls[0]![0].execute({}, { signal: new AbortController().signal })).resolves.toEqual({ content: [{ type: 'text', text: 'done' }] })

    scope.stop()
    expect(unregisterTool).toHaveBeenCalledWith('test')
  })

  it('keeps supporting document registration with abort-based cleanup', async () => {
    const registerTool = vi.fn<(tool: WebMCP.ModelContextTool, options: { signal: AbortSignal }) => Promise<void>>(async () => {})
    vi.stubGlobal('navigator', {})
    vi.stubGlobal('document', { modelContext: { registerTool } })
    const scope = effectScope()
    const state = scope.run(() => useWebMCP(tool))!
    await Promise.resolve()

    expect(state.isRegistered.value).toBe(true)
    const signal = registerTool.mock.calls[0]![1].signal
    expect(signal.aborted).toBe(false)
    scope.stop()
    expect(signal.aborted).toBe(true)
  })

  it('does not register when WebMCP is absent', () => {
    vi.stubGlobal('navigator', {})
    vi.stubGlobal('document', {})
    const scope = effectScope()
    const state = scope.run(() => useWebMCP(tool))!

    expect(state.isSupported.value).toBe(false)
    expect(state.isRegistered.value).toBe(false)
    scope.stop()
  })
})
