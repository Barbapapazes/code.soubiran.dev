import type { ToolSet } from 'ai'
import type { ExperimentalWebMcpToolDescriptor } from '@/app/experimental/webmcp'
import {
  dynamicTool,
  jsonSchema,
} from 'ai'
import { onScopeDispose, ref } from 'vue'
import {
  executeExperimentalWebMcpTool,
  getExperimentalWebMcpTools,
  isExperimentalWebMcpAvailable,
  onExperimentalWebMcpToolChange,
} from '@/app/experimental/webmcp'

export type WebMcpToolAvailability = 'unavailable' | 'available' | 'error'

function parseInputSchema(inputSchema: ExperimentalWebMcpToolDescriptor['inputSchema']) {
  const schema = typeof inputSchema === 'string' ? JSON.parse(inputSchema) : inputSchema

  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    throw new TypeError('WebMCP tool input schemas must be JSON objects.')
  }

  return schema as Record<string, unknown>
}

function isSameOriginTool(tool: ExperimentalWebMcpToolDescriptor) {
  return tool.origin === window.location.origin
}

function isToolDescriptor(value: unknown): value is ExperimentalWebMcpToolDescriptor {
  if (!value || typeof value !== 'object') {
    return false
  }

  const tool = value as Partial<ExperimentalWebMcpToolDescriptor>
  return typeof tool.name === 'string'
    && typeof tool.description === 'string'
    && typeof tool.origin === 'string'
    && (typeof tool.inputSchema === 'string' || (Boolean(tool.inputSchema) && typeof tool.inputSchema === 'object'))
}

export function useWebMcpAiSdkTools() {
  const availability = ref<WebMcpToolAvailability>(
    isExperimentalWebMcpAvailable() ? 'available' : 'unavailable',
  )
  const error = ref<string>()
  const tools = ref<ToolSet>({})
  let refreshVersion = 0

  async function refresh() {
    const requestVersion = ++refreshVersion

    if (!isExperimentalWebMcpAvailable()) {
      if (requestVersion !== refreshVersion) {
        return tools.value
      }

      availability.value = 'unavailable'
      tools.value = {}
      return tools.value
    }

    try {
      const descriptors = (await getExperimentalWebMcpTools())
        .filter(isToolDescriptor)
        .filter(isSameOriginTool)
      const nextTools: ToolSet = {}

      for (const descriptor of descriptors) {
        try {
          const inputSchema = parseInputSchema(descriptor.inputSchema)

          nextTools[descriptor.name] = dynamicTool({
            description: descriptor.description,
            inputSchema: jsonSchema(inputSchema),
            execute: async (input, { abortSignal }) => executeExperimentalWebMcpTool(
              descriptor,
              input as Record<string, unknown>,
              abortSignal,
            ),
          })
        }
        catch {
          // Ignore malformed descriptors so one third-party registration cannot disable text chat.
        }
      }

      if (requestVersion !== refreshVersion) {
        return tools.value
      }

      availability.value = 'available'
      error.value = undefined
      tools.value = nextTools
    }
    catch (cause) {
      if (requestVersion !== refreshVersion) {
        return tools.value
      }

      availability.value = 'error'
      error.value = cause instanceof Error ? cause.message : 'Unable to discover WebMCP tools.'
      tools.value = {}
    }

    return tools.value
  }

  const removeToolChangeListener = onExperimentalWebMcpToolChange(() => {
    void refresh()
  })
  void refresh()

  onScopeDispose(removeToolChangeListener)

  return {
    availability,
    error,
    refresh,
    tools,
  }
}
