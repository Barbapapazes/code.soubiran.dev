import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import { useWebMcpAiSdkTools } from './useWebMcpAiSdkTools'

const origin = 'https://code.soubiran.dev'

function tool(overrides: Partial<WebMCP.RegisteredTool> = {}): WebMCP.RegisteredTool {
  return {
    name: 'set_code',
    title: 'Set code',
    description: 'Update the editor code.',
    inputSchema: JSON.stringify({ type: 'object', properties: { code: { type: 'string' } } }),
    origin,
    window: {} as Window,
    ...overrides,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('webMCP AI SDK tools', () => {
  it('falls back safely when WebMCP is unavailable', async () => {
    vi.stubGlobal('document', {})

    const scope = effectScope()
    const webMcpTools = scope.run(() => useWebMcpAiSdkTools())!

    await webMcpTools.refresh()
    expect(webMcpTools.availability.value).toBe('unavailable')
    expect(webMcpTools.tools.value).toEqual({})
    scope.stop()
  })

  it('refreshes tools after a WebMCP toolchange event', async () => {
    let tools = [tool()]
    let toolChangeListener: (() => void) | undefined
    const removeEventListener = vi.fn()
    vi.stubGlobal('document', {
      defaultView: { location: { origin } },
      modelContext: {
        addEventListener: (_type: string, listener: () => void) => {
          toolChangeListener = listener
        },
        removeEventListener,
        executeTool: vi.fn(),
        getTools: async () => tools,
      },
    })

    const scope = effectScope()
    const webMcpTools = scope.run(() => useWebMcpAiSdkTools())!

    await vi.waitFor(() => {
      expect(toolChangeListener).toBeTypeOf('function')
    })

    await webMcpTools.refresh()
    expect(Object.keys(webMcpTools.tools.value)).toEqual(['set_code'])

    tools = [tool({ name: 'capture_code_image' })]
    toolChangeListener?.()

    await vi.waitFor(() => {
      expect(Object.keys(webMcpTools.tools.value)).toEqual(['capture_code_image'])
    })
    scope.stop()
    await vi.waitFor(() => {
      expect(removeEventListener).toHaveBeenCalledOnce()
    })
  })
})
