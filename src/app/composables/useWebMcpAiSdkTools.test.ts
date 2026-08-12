import type { ExperimentalWebMcpToolDescriptor } from '@/app/experimental/webmcp'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'
import {
  executeExperimentalWebMcpTool,
  getExperimentalWebMcpTools,
  isExperimentalWebMcpAvailable,
} from '@/app/experimental/webmcp'
import { useWebMcpAiSdkTools } from './useWebMcpAiSdkTools'

const origin = 'https://code.soubiran.dev'

function tool(overrides: Partial<ExperimentalWebMcpToolDescriptor> = {}): ExperimentalWebMcpToolDescriptor {
  return {
    name: 'set_code',
    description: 'Update the editor code.',
    inputSchema: JSON.stringify({ type: 'object', properties: { code: { type: 'string' } } }),
    origin,
    ...overrides,
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('webMCP AI SDK tools', () => {
  it('falls back safely when WebMCP is unavailable', async () => {
    vi.stubGlobal('document', {})

    expect(isExperimentalWebMcpAvailable()).toBe(false)
    await expect(getExperimentalWebMcpTools()).resolves.toEqual([])

    const scope = effectScope()
    const webMcpTools = scope.run(() => useWebMcpAiSdkTools())
    if (!webMcpTools) {
      throw new Error('Unable to create the WebMCP tool adapter.')
    }

    await webMcpTools.refresh()
    expect(webMcpTools.availability.value).toBe('unavailable')
    expect(webMcpTools.tools.value).toEqual({})
    scope.stop()
  })

  it('adapts only same-origin tools and forwards JSON inputs with the abort signal', async () => {
    const executeTool = vi.fn(async () => 'Updated the editor.')
    vi.stubGlobal('window', { location: { origin } })
    vi.stubGlobal('document', {
      modelContext: {
        executeTool,
        getTools: async () => [
          tool(),
          tool({ name: 'external', origin: 'https://example.com' }),
          tool({ name: 'invalid', inputSchema: '{' }),
        ],
      },
    })

    const scope = effectScope()
    const webMcpTools = scope.run(() => useWebMcpAiSdkTools())
    if (!webMcpTools) {
      throw new Error('Unable to create the WebMCP tool adapter.')
    }

    await webMcpTools.refresh()
    expect(Object.keys(webMcpTools.tools.value)).toEqual(['set_code'])

    const controller = new AbortController()
    const setCode = webMcpTools.tools.value.set_code
    if (!setCode?.execute) {
      throw new Error('Expected the set_code WebMCP tool.')
    }

    await expect(setCode.execute({ code: 'const answer = 42' }, { abortSignal: controller.signal } as never))
      .resolves
      .toBe('Updated the editor.')
    expect(executeTool).toHaveBeenCalledWith(
      tool(),
      JSON.stringify({ code: 'const answer = 42' }),
      { signal: controller.signal },
    )
    scope.stop()
  })

  it('passes execution failures through to the agent', async () => {
    const failure = new Error('The editor is busy.')
    const descriptor = tool()
    vi.stubGlobal('document', {
      modelContext: {
        executeTool: vi.fn(async () => { throw failure }),
        getTools: async () => [descriptor],
      },
    })

    await expect(executeExperimentalWebMcpTool(descriptor, { code: 'x' })).rejects.toThrow(failure)
  })

  it('refreshes tools after a WebMCP toolchange event', async () => {
    let tools = [tool()]
    let toolChangeListener: EventListener | undefined
    vi.stubGlobal('window', { location: { origin } })
    vi.stubGlobal('document', {
      modelContext: {
        addEventListener: (_type: string, listener: EventListener) => {
          toolChangeListener = listener
        },
        removeEventListener: vi.fn(),
        executeTool: vi.fn(),
        getTools: async () => tools,
      },
    })

    const scope = effectScope()
    const webMcpTools = scope.run(() => useWebMcpAiSdkTools())
    if (!webMcpTools || !toolChangeListener) {
      throw new Error('Expected a WebMCP toolchange listener.')
    }

    await webMcpTools.refresh()
    expect(Object.keys(webMcpTools.tools.value)).toEqual(['set_code'])

    tools = [tool({ name: 'capture_code_image' })]
    toolChangeListener(new Event('toolchange'))

    await vi.waitFor(() => {
      expect(Object.keys(webMcpTools.tools.value)).toEqual(['capture_code_image'])
    })
    scope.stop()
  })
})
