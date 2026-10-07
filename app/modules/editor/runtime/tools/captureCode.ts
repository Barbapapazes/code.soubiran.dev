import { z } from 'zod'

const inputSchema = z.object({}).strict()

export function createCaptureCodeTool(capture: () => Promise<void>) {
  return {
    name: 'capture_code',
    description: 'Capture and download the current code as screenshot.png.',
    inputSchema: z.toJSONSchema(inputSchema),
    async execute(input: Record<string, unknown>) {
      inputSchema.parse(input)
      await capture()

      return 'Downloaded the current code as screenshot.png.'
    },
  } satisfies WebMCP.ModelContextTool
}
