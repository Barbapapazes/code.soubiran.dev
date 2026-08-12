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

export interface ExperimentalWebMcpToolDescriptor {
  name: string
  description: string
  inputSchema: string | Record<string, unknown>
  origin: string
}

interface ExperimentalWebMcpModelContext {
  registerTool: (tool: ExperimentalWebMcpTool, options?: { signal?: AbortSignal }) => Promise<void>
  getTools?: () => Promise<readonly ExperimentalWebMcpToolDescriptor[]>
  executeTool?: (
    tool: ExperimentalWebMcpToolDescriptor,
    input: string,
    options?: { signal?: AbortSignal },
  ) => Promise<unknown>
  addEventListener?: (type: 'toolchange', listener: EventListener) => void
  removeEventListener?: (type: 'toolchange', listener: EventListener) => void
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

export function isExperimentalWebMcpAvailable() {
  const modelContext = getExperimentalWebMcpModelContext()

  return Boolean(modelContext?.getTools && modelContext.executeTool)
}

export async function getExperimentalWebMcpTools() {
  const modelContext = getExperimentalWebMcpModelContext()

  if (!modelContext?.getTools) {
    return []
  }

  return modelContext.getTools()
}

export async function executeExperimentalWebMcpTool(
  tool: ExperimentalWebMcpToolDescriptor,
  input: Record<string, unknown>,
  signal?: AbortSignal,
) {
  const modelContext = getExperimentalWebMcpModelContext()

  if (!modelContext?.executeTool) {
    throw new Error('WebMCP tools are unavailable in this browser.')
  }

  return modelContext.executeTool(tool, JSON.stringify(input), { signal })
}

export function onExperimentalWebMcpToolChange(listener: () => void) {
  const modelContext = getExperimentalWebMcpModelContext()

  if (!modelContext?.addEventListener || !modelContext.removeEventListener) {
    return () => {}
  }

  const eventListener: EventListener = () => listener()
  modelContext.addEventListener('toolchange', eventListener)

  return () => modelContext.removeEventListener?.('toolchange', eventListener)
}
