import type { WebMcpDocument } from './createWebMCPClient'
import { describe, expect, it, vi } from 'vitest'
import { createWebMCPClient } from './createWebMCPClient'

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

function createDocument(modelContext?: Partial<WebMCP.ModelContext> & { executeTool?: (...args: any[]) => Promise<unknown> }): WebMcpDocument {
  return {
    defaultView: { location: { origin } } as Window,
    modelContext: modelContext as WebMCP.ModelContext,
  }
}

describe('createWebMCPClient', () => {
  it('keeps clients usable without WebMCP and returns no tools', async () => {
    const client = await createWebMCPClient({ document: {} })

    expect(client.availability).toBe('unavailable')
    await expect(client.listTools()).resolves.toEqual([])
    await expect(client.tools()).resolves.toEqual({})
  })

  it('discovers approved tools and adapts them for the AI SDK', async () => {
    const executeTool = vi.fn(async () => 'Updated the editor.')
    const client = await createWebMCPClient({
      document: createDocument({
        executeTool,
        getTools: async () => [
          tool(),
          tool({ name: 'external', origin: 'https://example.com' }),
          tool({ name: 'invalid', inputSchema: '{' }),
        ],
      }),
    })

    await expect(client.listTools()).resolves.toEqual([tool(), tool({ name: 'invalid', inputSchema: '{' })])

    const tools = await client.tools()
    expect(Object.keys(tools)).toEqual(['set_code'])

    const controller = new AbortController()
    const setCode = tools.set_code
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
  })

  it('accepts explicitly allowlisted cross-origin tools', async () => {
    const externalTool = tool({ name: 'external', origin: 'https://example.com' })
    const getTools = vi.fn(async () => [externalTool])
    const client = await createWebMCPClient({
      document: createDocument({ executeTool: vi.fn(), getTools }),
      fromOrigins: ['https://example.com'],
    })

    await expect(client.listTools()).resolves.toEqual([externalTool])
    expect(getTools).toHaveBeenCalledWith({ fromOrigins: ['https://example.com'] })
  })

  it('rejects ambiguous calls and forwards named calls to the browser', async () => {
    const executeTool = vi.fn(async () => ({ ok: true }))
    const namedClient = await createWebMCPClient({
      document: createDocument({ executeTool, getTools: async () => [tool()] }),
    })

    await expect(namedClient.callTool({ name: 'set_code', arguments: { code: 'x' } })).resolves.toEqual({ ok: true })
    expect(executeTool).toHaveBeenCalledWith(tool(), JSON.stringify({ code: 'x' }), { signal: undefined })

    const ambiguousClient = await createWebMCPClient({
      document: createDocument({ executeTool, getTools: async () => [tool(), tool({ origin: 'https://example.com' })] }),
      fromOrigins: ['https://example.com'],
    })
    await expect(ambiguousClient.callTool({ name: 'set_code' })).rejects.toThrow('ambiguous')
    await expect(ambiguousClient.tools()).resolves.toEqual({})
  })

  it('lists the initially available tools without subscribing to changes', async () => {
    const getTools = vi.fn(async () => [tool()])
    const client = await createWebMCPClient({
      document: createDocument({
        executeTool: vi.fn(),
        getTools,
      }),
    })

    await expect(client.listTools()).resolves.toEqual([tool()])
    expect(getTools).toHaveBeenCalledOnce()
  })
})
