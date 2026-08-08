import type { CodeImageEnvironment } from '@/server/types'
import { describe, expect, it, vi } from 'vitest'
import { BrowserRunError } from '@/server/errors'
import { executeGenerateCodeImageTool } from '@/server/mcp'

const env: CodeImageEnvironment = {
  BROWSER_RUN_ACCOUNT_ID: 'account-id',
  BROWSER_RUN_API_TOKEN: 'secret-token',
}

describe('executeGenerateCodeImageTool', () => {
  it('records privacy-safe usage details when image generation succeeds', async () => {
    const logger = {
      set: vi.fn(),
      setLevel: vi.fn(),
    }

    const result = await executeGenerateCodeImageTool(
      env,
      {
        code: 'x',
        language: 'typescript',
        title: 'Sensitive title',
      },
      logger,
      async () => ({ data: 'iVBORw==', mimeType: 'image/png' }),
    )

    expect(result).toEqual({
      content: [{ type: 'image', data: 'iVBORw==', mimeType: 'image/png' }],
    })
    expect(logger.set).toHaveBeenCalledWith({
      mcp: expect.objectContaining({
        endpoint: 'mcp',
        tool: 'generate_code_image',
        input: {
          code: { supplied: true, length: 1 },
          language: 'typescript',
          size: 'md',
          gradient: 'purple',
          titleSupplied: true,
          watermarkSupplied: false,
        },
        outcome: 'success',
        durationMs: expect.any(Number),
        image: { bytes: 4, mimeType: 'image/png' },
      }),
    })
    expect(logger.setLevel).not.toHaveBeenCalled()
  })

  it('records a classified failure without logging the error message', async () => {
    const logger = {
      set: vi.fn(),
      setLevel: vi.fn(),
    }

    const result = await executeGenerateCodeImageTool(
      env,
      { code: 'secret source code' },
      logger,
      async () => {
        throw new BrowserRunError(429, 'sensitive upstream response')
      },
    )

    expect(result).toEqual({
      content: [{ type: 'text', text: 'Unable to generate the code image. Please try again.' }],
      isError: true,
    })
    expect(logger.setLevel).toHaveBeenCalledWith('error')
    expect(logger.set).toHaveBeenCalledWith({
      mcp: expect.objectContaining({
        outcome: 'error',
        error: { type: 'browser-run', status: 429 },
      }),
    })
    expect(JSON.stringify(logger.set.mock.calls)).not.toContain('secret source code')
    expect(JSON.stringify(logger.set.mock.calls)).not.toContain('sensitive upstream response')
  })
})
