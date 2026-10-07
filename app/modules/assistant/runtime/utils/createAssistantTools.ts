import type { ToolSet } from 'ai'
import { dynamicTool, jsonSchema } from 'ai'

/** Use the same tool definitions locally without relying on browser WebMCP discovery. */
export function createAssistantTools(definitions: readonly WebMCP.ModelContextTool[]): ToolSet {
  return Object.fromEntries(definitions.map(definition => [definition.name, dynamicTool({
    description: definition.description,
    inputSchema: jsonSchema(definition.inputSchema ?? { type: 'object', properties: {} }),
    execute: (input, { abortSignal }) => definition.execute(input as Record<string, unknown>, {
      signal: abortSignal ?? new AbortController().signal,
    }),
  })]))
}
