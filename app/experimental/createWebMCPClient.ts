import type { ToolSet } from 'ai'
import {
  dynamicTool,
  jsonSchema,
} from 'ai'

/** Chrome's experimental in-page agent extension; it is not part of WebMCP yet. */
export interface ExperimentalWebMcpToolExecutor {
  executeTool: (
    tool: WebMCP.RegisteredTool,
    input: string,
    options?: { signal?: AbortSignal },
  ) => Promise<unknown>
}

type WebMcpModelContext = WebMCP.ModelContext & Partial<ExperimentalWebMcpToolExecutor>

export interface WebMcpDocument {
  defaultView?: Pick<Window, 'location'> | null
  modelContext?: WebMcpModelContext
}

export interface CreateWebMCPClientOptions {
  document?: WebMcpDocument
  fromOrigins?: readonly string[]
}

export interface WebMcpCallToolOptions {
  signal?: AbortSignal
}

export interface WebMcpCallToolArgs {
  name: string
  arguments?: Record<string, unknown>
  options?: WebMcpCallToolOptions
}

export type WebMcpToolAvailability = 'available' | 'unavailable'

export interface WebMCPClient {
  readonly availability: WebMcpToolAvailability
  listTools: () => Promise<readonly WebMCP.RegisteredTool[]>
  callTool: (args: WebMcpCallToolArgs) => Promise<unknown>
  executeTool: (tool: WebMCP.RegisteredTool, input: Record<string, unknown>, options?: WebMcpCallToolOptions) => Promise<unknown>
  tools: () => Promise<ToolSet>
  toolsFromDefinitions: (definitions: readonly WebMCP.RegisteredTool[]) => ToolSet
}

function isToolDescriptor(value: unknown): value is WebMCP.RegisteredTool {
  if (!value || typeof value !== 'object') {
    return false
  }

  const tool = value as Partial<WebMCP.RegisteredTool>
  return typeof tool.name === 'string'
    && typeof tool.description === 'string'
    && typeof tool.origin === 'string'
    && (tool.inputSchema === undefined || typeof tool.inputSchema === 'string')
}

function parseInputSchema(inputSchema: string | undefined) {
  const schema = inputSchema === undefined ? {} : JSON.parse(inputSchema)

  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    throw new TypeError('WebMCP tool input schemas must be JSON objects.')
  }

  return schema as Record<string, unknown>
}

function getDefaultDocument() {
  return globalThis.document as WebMcpDocument | undefined
}

export function createWebMCPClient(options: CreateWebMCPClientOptions = {}): WebMCPClient {
  const document = options.document ?? getDefaultDocument()
  const modelContext = document?.modelContext
  const fromOrigins = [...(options.fromOrigins ?? [])]
  const allowedOrigins = new Set([document?.defaultView?.location.origin, ...fromOrigins])

  function isAvailable() {
    return Boolean(modelContext?.getTools && modelContext.executeTool)
  }

  async function listTools() {
    if (!modelContext?.executeTool) {
      return []
    }

    const descriptors = await modelContext.getTools({ fromOrigins })
    return descriptors.filter(isToolDescriptor).filter(tool => allowedOrigins.has(tool.origin))
  }

  async function executeTool(
    tool: WebMCP.RegisteredTool,
    input: Record<string, unknown>,
    callOptions: WebMcpCallToolOptions = {},
  ) {
    if (!modelContext?.executeTool) {
      throw new Error('WebMCP tools are unavailable in this browser.')
    }

    return modelContext.executeTool(tool, JSON.stringify(input), { signal: callOptions.signal })
  }

  async function callTool({ name, arguments: input = {}, options: callOptions }: WebMcpCallToolArgs) {
    const matches = (await listTools()).filter(tool => tool.name === name)

    if (matches.length === 0) {
      throw new Error(`WebMCP tool "${name}" was not found.`)
    }

    if (matches.length > 1) {
      throw new Error(`WebMCP tool "${name}" is ambiguous across documents.`)
    }

    return executeTool(matches[0], input, callOptions)
  }

  function toolsFromDefinitions(definitions: readonly WebMCP.RegisteredTool[]): ToolSet {
    const duplicatedNames = new Set<string>()
    const toolSet: ToolSet = {}

    for (const descriptor of definitions) {
      if (duplicatedNames.has(descriptor.name)) {
        continue
      }

      if (toolSet[descriptor.name]) {
        delete toolSet[descriptor.name]
        duplicatedNames.add(descriptor.name)
        continue
      }

      try {
        toolSet[descriptor.name] = dynamicTool({
          description: descriptor.description,
          inputSchema: jsonSchema(parseInputSchema(descriptor.inputSchema)),
          execute: (input, { abortSignal }) => executeTool(
            descriptor,
            input as Record<string, unknown>,
            { signal: abortSignal },
          ),
        })
      }
      catch {
        // Ignore malformed descriptors so one third-party registration cannot disable text chat.
      }
    }

    return toolSet
  }

  async function tools() {
    return toolsFromDefinitions(await listTools())
  }

  return {
    get availability() {
      return isAvailable() ? 'available' : 'unavailable'
    },
    listTools,
    callTool,
    executeTool,
    tools,
    toolsFromDefinitions,
  }
}
