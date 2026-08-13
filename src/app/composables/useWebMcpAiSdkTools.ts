import type { ToolSet } from 'ai'
import type { WebMcpToolAvailability } from '@/app/experimental/createWebMCPClient'
import { onScopeDispose, ref } from 'vue'
import {
  createWebMCPClient,

} from '@/app/experimental/createWebMCPClient'

export type { WebMcpToolAvailability } from '@/app/experimental/createWebMCPClient'

type WebMcpToolsStatus = WebMcpToolAvailability | 'error'

export function useWebMcpAiSdkTools() {
  const availability = ref<WebMcpToolsStatus>('unavailable')
  const error = ref<string>()
  const tools = ref<ToolSet>({})
  const clientPromise = createWebMCPClient()
  let refreshVersion = 0

  async function refresh() {
    const requestVersion = ++refreshVersion
    const client = await clientPromise

    if (client.availability === 'unavailable') {
      if (requestVersion !== refreshVersion) {
        return tools.value
      }

      availability.value = 'unavailable'
      tools.value = {}
      return tools.value
    }

    try {
      const nextTools = await client.tools()

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

  void clientPromise.then((client) => {
    client.onToolChange(() => {
      void refresh()
    })
  })
  void refresh()

  onScopeDispose(() => {
    void clientPromise.then(client => client.close())
  })

  return {
    availability,
    error,
    refresh,
    tools,
  }
}
