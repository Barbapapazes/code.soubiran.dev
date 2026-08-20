import type { Ref } from 'vue'
import type { Gradient } from '@/app/types/gradient'
import type { CodeImageLanguage, CodeImageSize } from '@/shared/code-image'
import { nextTick } from 'vue'
import { z } from 'zod'
import {
  codeImageGradientValues,
  codeImageLanguageValues,
  codeImageSizeValues,
} from '@/shared/code-image'

const inputSchema = z.object({
  language: z.enum(codeImageLanguageValues).optional().describe('Syntax-highlighting language for the code image.'),
  size: z.enum(codeImageSizeValues).optional().describe('Canvas size for the code image.'),
  gradient: z.enum(codeImageGradientValues).optional().describe('Background gradient for the code image.'),
  title: z.string().optional().describe('Title displayed above the code. Use an empty string to remove it.'),
  watermark: z.string().optional().describe('Watermark displayed below the code. Use an empty string to remove it.'),
}).strict().refine(input => Object.keys(input).length > 0, 'Provide at least one option to update.')

interface CodeImageOptions {
  language: Ref<CodeImageLanguage>
  size: Ref<CodeImageSize>
  gradient: Ref<Gradient>
  title: Ref<string>
  watermark: Ref<string>
}

export function createSetCodeOptionsTool(options: CodeImageOptions) {
  return {
    name: 'set_code_options',
    description: 'Set one or more visual options for the current code: language, canvas size, background gradient, title, or watermark. Use only for options the user explicitly requests. It may run in parallel with set_code; both must succeed before capture_code.',
    inputSchema: z.toJSONSchema(inputSchema),
    async execute(input: Record<string, unknown>) {
      const { gradient, language, size, title, watermark } = inputSchema.parse(input)
      const updates: Array<() => void> = []

      if (language !== undefined) {
        updates.push(() => {
          options.language.value = language
        })
      }
      if (size !== undefined) {
        updates.push(() => {
          options.size.value = size
        })
      }
      if (gradient !== undefined) {
        updates.push(() => {
          options.gradient.value = gradient
        })
      }
      if (title !== undefined) {
        updates.push(() => {
          options.title.value = title
        })
      }
      if (watermark !== undefined) {
        updates.push(() => {
          options.watermark.value = watermark
        })
      }

      for (const update of updates) {
        update()
        await nextTick()
      }

      return { updated: Object.keys(input) }
    },
  } satisfies WebMCP.ModelContextTool
}
