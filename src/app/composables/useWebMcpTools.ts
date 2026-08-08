import type { ExperimentalWebMcpTool } from '@/app/experimental/webmcp'
import type { Gradient } from '@/app/types/gradient'
import type { CodeImageLanguage, CodeImageSize } from '@/shared/code-image'
import { nextTick } from 'vue'
import {

  registerExperimentalWebMcpTools,
} from '@/app/experimental/webmcp'
import {
  codeImageGradientValues,
  codeImageLanguageValues,
  codeImageSizeValues,
} from '@/shared/code-image'

interface WebMcpEditorState {
  code: Ref<string>
  language: Ref<CodeImageLanguage>
  size: Ref<CodeImageSize>
  gradient: Ref<Gradient>
  title: Ref<string>
  watermark: Ref<string>
  capture: () => Promise<void>
}

function assertString(value: unknown, name: string): string {
  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be a string.`)
  }

  return value
}

function assertOption<T extends string>(value: unknown, values: readonly T[], name: string): T {
  const option = assertString(value, name)

  if (!values.includes(option as T)) {
    throw new TypeError(`${name} must be one of: ${values.join(', ')}.`)
  }

  return option as T
}

function assertOnlyKnownOptions(input: Record<string, unknown>, allowedOptions: readonly string[]) {
  const unknownOption = Object.keys(input).find(option => !allowedOptions.includes(option))

  if (unknownOption) {
    throw new TypeError(`Unknown option: ${unknownOption}.`)
  }
}

export async function registerWebMcpTools(state: WebMcpEditorState, signal: AbortSignal) {
  const tools = [
    {
      name: 'set_code',
      description: 'Replace the code in the image editor with the provided text.',
      inputSchema: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
            description: 'The complete code to display in the image editor.',
          },
        },
        required: ['code'],
        additionalProperties: false,
      },
      execute: async (input) => {
        assertOnlyKnownOptions(input, ['code'])
        state.code.value = assertString(input.code, 'code')
        await nextTick()

        return { codeLength: state.code.value.length }
      },
    },
    {
      name: 'set_code_image_options',
      description: 'Update one or more image editor options: language, canvas size, gradient, title, or watermark.',
      inputSchema: {
        type: 'object',
        properties: {
          language: {
            type: 'string',
            enum: codeImageLanguageValues,
            description: 'Syntax-highlighting language for the code image.',
          },
          size: {
            type: 'string',
            enum: codeImageSizeValues,
            description: 'Canvas size for the code image.',
          },
          gradient: {
            type: 'string',
            enum: codeImageGradientValues,
            description: 'Background gradient for the code image.',
          },
          title: {
            type: 'string',
            description: 'Title displayed above the code. Use an empty string to remove it.',
          },
          watermark: {
            type: 'string',
            description: 'Watermark displayed below the code. Use an empty string to remove it.',
          },
        },
        minProperties: 1,
        additionalProperties: false,
      },
      execute: async (input) => {
        const options = ['language', 'size', 'gradient', 'title', 'watermark'] as const
        assertOnlyKnownOptions(input, options)

        if (Object.keys(input).length === 0) {
          throw new TypeError('Provide at least one option to update.')
        }

        const language = input.language === undefined
          ? undefined
          : assertOption(input.language, codeImageLanguageValues, 'language')
        const size = input.size === undefined
          ? undefined
          : assertOption(input.size, codeImageSizeValues, 'size')
        const gradient = input.gradient === undefined
          ? undefined
          : assertOption(input.gradient, codeImageGradientValues, 'gradient')
        const title = input.title === undefined ? undefined : assertString(input.title, 'title')
        const watermark = input.watermark === undefined ? undefined : assertString(input.watermark, 'watermark')

        const updates: Array<() => void> = []

        if (language !== undefined) {
          updates.push(() => {
            state.language.value = language
          })
        }
        if (size !== undefined) {
          updates.push(() => {
            state.size.value = size
          })
        }
        if (gradient !== undefined) {
          updates.push(() => {
            state.gradient.value = gradient
          })
        }
        if (title !== undefined) {
          updates.push(() => {
            state.title.value = title
          })
        }
        if (watermark !== undefined) {
          updates.push(() => {
            state.watermark.value = watermark
          })
        }

        for (const update of updates) {
          update()
          await nextTick()
        }

        return { updated: Object.keys(input) }
      },
    },
    {
      name: 'capture_code_image',
      description: 'Download the current code image as a PNG file named screenshot.png.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      execute: async (input) => {
        assertOnlyKnownOptions(input, [])
        await state.capture()

        return 'Downloaded the current code image as screenshot.png.'
      },
    },
  ] satisfies ExperimentalWebMcpTool[]

  await registerExperimentalWebMcpTools(tools, signal)
}
