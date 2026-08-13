/**
 * Compatibility boundary for the experimental WebMCP browser API.
 *
 * Application tool behavior belongs elsewhere. Tool discovery and execution
 * belong to createWebMCPClient.
 */
export interface ExperimentalWebMcpTool extends Omit<WebMCP.ModelContextTool, 'execute' | 'inputSchema'> {
  inputSchema: Record<string, unknown>
  execute: (input: Record<string, unknown>) => unknown | Promise<unknown>
}

export async function registerExperimentalWebMcpTools(
  tools: readonly ExperimentalWebMcpTool[],
  signal: AbortSignal,
) {
  const modelContext = document.modelContext

  if (!modelContext) {
    return
  }

  await Promise.all(tools.map(tool => modelContext.registerTool(tool, { signal })))
}
