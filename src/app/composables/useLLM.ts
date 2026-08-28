import type { BrowserAIChatLanguageModel } from '@browser-ai/core'
import { browserAI, doesBrowserSupportBrowserAI } from '@browser-ai/core'

export type LLMAvailability
  = | 'checking'
    | 'unavailable'
    | 'available'
    | 'downloadable'
    | 'downloading'
    | 'preparing'
    | 'error'

export function useLLM() {
  const availability = ref<LLMAvailability>('checking')
  const downloadProgress = ref<number>()
  const initializationError = ref<string>()
  const model = ref<BrowserAIChatLanguageModel>()
  let initializationPromise: Promise<void> | undefined

  function getModel() {
    return model.value ??= browserAI('text')
  }

  function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : 'The local model could not be prepared.'
  }

  async function checkAvailability() {
    if (!doesBrowserSupportBrowserAI()) {
      availability.value = 'unavailable'
      return
    }

    try {
      const nextAvailability = await getModel().availability()

      if (nextAvailability === 'available') {
        availability.value = 'available'
        initializationError.value = undefined
        return
      }

      if (nextAvailability === 'downloadable') {
        availability.value = 'downloadable'
        return
      }

      availability.value = 'unavailable'
    }
    catch {
      availability.value = 'unavailable'
    }
  }

  function initialize() {
    if (initializationPromise) {
      return initializationPromise
    }

    availability.value = 'downloading'
    downloadProgress.value = undefined
    initializationError.value = undefined

    initializationPromise = (async () => {
      model.value = await getModel().createSessionWithProgress((progress) => {
        downloadProgress.value = Math.round(progress * 100)
        availability.value = progress >= 1 ? 'preparing' : 'downloading'
      })

      downloadProgress.value = 100
      availability.value = 'available'
    })().catch((cause: unknown) => {
      initializationError.value = getErrorMessage(cause)
      availability.value = 'error'
    }).finally(() => {
      initializationPromise = undefined
    })

    return initializationPromise
  }

  return {
    availability,
    checkAvailability,
    downloadProgress,
    getModel,
    initializationError,
    initialize,
  }
}
