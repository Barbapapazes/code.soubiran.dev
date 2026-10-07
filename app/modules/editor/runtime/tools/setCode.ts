import type { Ref } from 'vue'
import { nextTick } from 'vue'
import { z } from 'zod'

const inputSchema = z.object({
  code: z.string().describe('The complete replacement source code to display. Preserve the user-provided text exactly, including whitespace and line breaks.'),
}).strict()

export function createSetCodeTool(code: Ref<string>) {
  return {
    name: 'set_code',
    description: 'Set the complete source code shown in the code image editor. Use this whenever the user supplies code they want displayed, changed, rendered, or captured. It may run in parallel with set_code_options; both must succeed before capture_code.',
    inputSchema: z.toJSONSchema(inputSchema),
    async execute(input: Record<string, unknown>) {
      code.value = inputSchema.parse(input).code
      await nextTick()

      return { codeLength: code.value.length }
    },
  } satisfies WebMCP.ModelContextTool
}
