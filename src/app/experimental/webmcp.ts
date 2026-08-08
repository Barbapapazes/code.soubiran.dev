/**
 * Compatibility boundary for the experimental WebMCP browser API.
 *
 * Update this module when the API is standardized or when its TypeScript DOM
 * declarations become available. Application tool behavior belongs elsewhere.
 */
export interface ExperimentalWebMcpTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (input: Record<string, unknown>) => unknown | Promise<unknown>
}

interface ExperimentalWebMcpModelContext {
  registerTool: (tool: ExperimentalWebMcpTool, options?: { signal?: AbortSignal }) => Promise<void>
}

function getExperimentalWebMcpModelContext(): ExperimentalWebMcpModelContext | undefined {
  return (document as Document & { modelContext?: ExperimentalWebMcpModelContext }).modelContext
}

export async function registerExperimentalWebMcpTools(
  tools: readonly ExperimentalWebMcpTool[],
  signal: AbortSignal,
) {
  const modelContext = getExperimentalWebMcpModelContext()

  if (!modelContext) {
    return
  }

  await Promise.all(tools.map(tool => modelContext.registerTool(tool, { signal })))
}
