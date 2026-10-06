import type { CodeImageEnvironment } from './types'
import { describe, expect, it, vi } from 'vitest'
import { BrowserRunError } from './errors'
import { createCodeImageMcpServer, executeGenerateCodeImageTool } from './mcp'

const env: CodeImageEnvironment = {
  BROWSER_RUN_ACCOUNT_ID: 'account',
  BROWSER_RUN_API_TOKEN: 'secret-token',
}

function logger() {
  return { set: vi.fn(), setLevel: vi.fn() }
}

describe('code image MCP tool', () => {
  it('creates an MCP server with the existing identity', () => {
    expect(createCodeImageMcpServer(env)).toBeDefined()
  })

  it('returns PNG content and logs metadata without source code or credentials', async () => {
    const log = logger()
    const generateImage = vi.fn(async () => ({ data: 'aGVsbG8=', mimeType: 'image/png' }))
    const input = { code: 'private source code', title: 'private title', language: 'typescript' as const }

    const result = await executeGenerateCodeImageTool(env, input, log, generateImage)

    expect(generateImage).toHaveBeenCalledExactlyOnceWith(env, input)
    expect(result).toEqual({ content: [{ type: 'image', data: 'aGVsbG8=', mimeType: 'image/png' }] })
    expect(log.set).toHaveBeenCalledWith({
      mcp: expect.objectContaining({
        tool: 'generate_code_image',
        outcome: 'success',
        image: { bytes: 5, mimeType: 'image/png' },
        input: expect.objectContaining({ code: { supplied: true, length: 19 }, language: 'typescript' }),
      }),
    })
    expect(JSON.stringify(log.set.mock.calls)).not.toContain(input.code)
    expect(JSON.stringify(log.set.mock.calls)).not.toContain(input.title)
    expect(JSON.stringify(log.set.mock.calls)).not.toContain(env.BROWSER_RUN_API_TOKEN)
  })

  it('returns a safe MCP error when Browser Run fails', async () => {
    const log = logger()
    const generateImage = vi.fn(async () => {
      throw new BrowserRunError(503, 'private upstream details')
    })

    const result = await executeGenerateCodeImageTool(env, {}, log, generateImage)

    expect(result).toEqual({
      content: [{ type: 'text', text: 'Unable to generate the code image. Please try again.' }],
      isError: true,
    })
    expect(log.setLevel).toHaveBeenCalledWith('error')
    expect(log.set).toHaveBeenCalledWith({
      mcp: expect.objectContaining({ outcome: 'error', error: { type: 'browser-run', status: 503 } }),
    })
    expect(JSON.stringify(log.set.mock.calls)).not.toContain('private upstream details')
  })
})
