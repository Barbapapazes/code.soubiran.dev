import type { AuditableLogger } from 'evlog'
import type { CodeImageEnvironment } from './types'
import { McpServer } from '@modelcontextprotocol/server'
import { wrapMcpServerWithSentry } from '@sentry/cloudflare'
import { z } from 'zod'
import {
  codeImageGradientValues,
  codeImageLanguageValues,
  codeImageSizeValues,
} from '../shared/code-image'
import { generateCodeImage } from './code-image-screenshot'
import { BrowserRunError } from './errors'
import { reportWorkerError } from './observability'
import { codeImageDefaults } from './types'

type McpLogger = Pick<AuditableLogger, 'set' | 'setLevel'>

const codeImageToolName = 'generate_code_image'

function getBase64ByteLength(value: string): number {
  const padding = value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0
  return (value.length / 4) * 3 - padding
}

function getMcpErrorDetails(error: unknown) {
  if (error instanceof BrowserRunError) {
    return {
      type: 'browser-run',
      status: error.status,
    }
  }

  return {
    type: error instanceof Error ? error.name : 'unknown',
  }
}

export async function executeGenerateCodeImageTool(
  env: CodeImageEnvironment,
  input: Parameters<typeof generateCodeImage>[1],
  logger?: McpLogger,
  generateImage: typeof generateCodeImage = generateCodeImage,
) {
  const startedAt = performance.now()
  const toolInput = {
    code: {
      supplied: input.code !== undefined,
      length: input.code?.length ?? 0,
    },
    language: input.language ?? codeImageDefaults.language,
    size: input.size ?? codeImageDefaults.size,
    gradient: input.gradient ?? codeImageDefaults.gradient,
    titleSupplied: input.title !== undefined,
    watermarkSupplied: input.watermark !== undefined,
  }

  try {
    const image = await generateImage(env, input)

    logger?.set({
      mcp: {
        endpoint: 'mcp',
        tool: codeImageToolName,
        input: toolInput,
        outcome: 'success',
        durationMs: Math.round(performance.now() - startedAt),
        image: {
          bytes: getBase64ByteLength(image.data),
          mimeType: image.mimeType,
        },
      },
    })

    return {
      content: [
        {
          type: 'image' as const,
          data: image.data,
          mimeType: image.mimeType,
        },
      ],
    }
  }
  catch (error) {
    reportWorkerError(error, codeImageToolName)
    logger?.setLevel('error')
    logger?.set({
      mcp: {
        endpoint: 'mcp',
        tool: codeImageToolName,
        input: toolInput,
        outcome: 'error',
        durationMs: Math.round(performance.now() - startedAt),
        error: getMcpErrorDetails(error),
      },
    })

    return {
      content: [
        {
          type: 'text' as const,
          text: 'Unable to generate the code image. Please try again.',
        },
      ],
      isError: true,
    }
  }
}

export function createCodeImageMcpServer(
  env: CodeImageEnvironment,
  logger?: McpLogger,
): McpServer {
  const server = wrapMcpServerWithSentry(new McpServer({
    name: 'code.soubiran.dev',
    version: '1.0.0',
  }), { recordInputs: false, recordOutputs: false })

  server.registerTool(
    codeImageToolName,
    {
      description: 'Generate a PNG image of a syntax-highlighted code snippet using code.soubiran.dev.',
      inputSchema: z.object({
        code: z.string().optional().describe('The source code to render.'),
        language: z.enum(codeImageLanguageValues).optional().describe(`The code language. Defaults to ${codeImageDefaults.language}.`),
        size: z.enum(codeImageSizeValues).optional().describe(`The canvas size. Defaults to ${codeImageDefaults.size}.`),
        gradient: z.enum(codeImageGradientValues).optional().describe(`The background gradient. Defaults to ${codeImageDefaults.gradient}.`),
        title: z.string().optional().describe('An optional title above the code.'),
        watermark: z.string().optional().describe('An optional watermark below the code.'),
      }),
    },
    input => executeGenerateCodeImageTool(env, input, logger),
  )

  return server
}
