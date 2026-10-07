import type { MaybeRefOrGetter, ShallowRef } from 'vue'
import { computed, onScopeDispose, shallowRef, toValue, watch } from 'vue'

/**
 * Temporary local copy of VueUse PR #5580's `useWebMCP` composable.
 * Replace this with `@vueuse/core` once the composable is released.
 */

interface WebMCPToolContent {
  type: string
  text?: string
  [key: string]: unknown
}

interface WebMCPToolResponse {
  content: WebMCPToolContent[]
  isError?: boolean
}

export interface UseWebMCPOptions<Args extends Record<string, unknown>, Result> {
  name: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  inputSchema?: MaybeRefOrGetter<object | undefined>
  annotations?: MaybeRefOrGetter<WebMCP.ToolAnnotations | undefined>
  execute: (args: Args) => Result | Promise<Result>
  enabled?: MaybeRefOrGetter<boolean>
  formatOutput?: (result: Result, args: Args) => unknown
  onError?: (error: unknown) => void
}

export interface UseWebMCPReturn {
  isSupported: Readonly<ShallowRef<boolean>>
  isRegistered: ShallowRef<boolean>
  error: ShallowRef<Error | null>
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value)
  }
  catch {
    return String(value)
  }
}

function toToolResponse(value: unknown): WebMCPToolResponse {
  if (value && typeof value === 'object' && 'content' in value && Array.isArray(value.content)) {
    return value as WebMCPToolResponse
  }

  if (value === undefined || value === null) {
    return { content: [] }
  }

  if (typeof value === 'string') {
    return { content: [{ type: 'text', text: value }] }
  }

  return { content: [{ type: 'text', text: safeStringify(value) }] }
}

function toErrorResponse(error: unknown): WebMCPToolResponse {
  const text = error instanceof Error
    ? error.message
    : typeof error === 'string'
      ? error
      : safeStringify(error)

  return { content: [{ type: 'text', text }], isError: true }
}

export function useWebMCP<Args extends Record<string, unknown>, Result>(
  options: UseWebMCPOptions<Args, Result>,
): UseWebMCPReturn {
  // Chromium exposes registration on navigator; older prototypes used document.
  const navigatorContext = (globalThis.navigator as (Navigator & {
    modelContext?: {
      registerTool: (tool: WebMCP.ModelContextTool) => void | Promise<void>
      unregisterTool: (name: string) => void
    }
  }) | undefined)?.modelContext
  const documentContext = globalThis.document?.modelContext
  const modelContext = navigatorContext ?? documentContext
  const isSupported = computed(() => typeof modelContext?.registerTool === 'function')
  const isRegistered = shallowRef(false)
  const error = shallowRef<Error | null>(null)
  let controller: AbortController | undefined
  let unregister: (() => void) | undefined

  function cleanup() {
    unregister?.()
    unregister = undefined
    controller?.abort()
    controller = undefined
    isRegistered.value = false
  }

  async function register() {
    cleanup()
    error.value = null

    if (!modelContext || !isSupported.value || !toValue(options.enabled ?? true)) {
      return
    }

    const nextController = new AbortController()
    controller = nextController

    try {
      const tool: WebMCP.ModelContextTool = {
        name: toValue(options.name),
        description: toValue(options.description),
        inputSchema: toValue(options.inputSchema),
        annotations: toValue(options.annotations),
        async execute(input: Record<string, unknown>) {
          try {
            const args = input as Args
            const result = await options.execute(args)
            const output = options.formatOutput ? options.formatOutput(result, args) : result

            if (output instanceof Error) {
              throw output
            }

            return toToolResponse(output)
          }
          catch (cause) {
            try {
              options.onError?.(cause)
            }
            catch {
              // Error observers must not make the WebMCP tool execution fail.
            }

            return toErrorResponse(cause)
          }
        },
      }

      if (navigatorContext) {
        await navigatorContext.registerTool(tool)
        if (nextController.signal.aborted) {
          navigatorContext.unregisterTool(tool.name)
          return
        }
        unregister = () => navigatorContext.unregisterTool(tool.name)
      }
      else if (documentContext) {
        await documentContext.registerTool(tool, { signal: nextController.signal })
      }

      if (controller === nextController && !nextController.signal.aborted) {
        isRegistered.value = true
      }
    }
    catch (cause) {
      if (controller === nextController && !nextController.signal.aborted) {
        error.value = cause instanceof Error ? cause : new Error(safeStringify(cause))
      }
    }
  }

  watch(
    [
      isSupported,
      () => toValue(options.name),
      () => toValue(options.description),
      () => toValue(options.inputSchema) === undefined ? '' : safeStringify(toValue(options.inputSchema)),
      () => toValue(options.annotations) === undefined ? '' : safeStringify(toValue(options.annotations)),
      () => toValue(options.enabled ?? true),
    ],
    () => {
      void register()
    },
    { immediate: true, flush: 'post' },
  )

  onScopeDispose(cleanup)

  return { isSupported, isRegistered, error }
}
