import type { BrowserAIChatLanguageModel } from '@browser-ai/core'
import { browserAI, doesBrowserSupportBrowserAI } from '@browser-ai/core'
import { computed, ref } from 'vue'

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
  const isReady = ref(false)
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
      isReady.value = false
      return
    }

    try {
      const nextAvailability = await getModel().availability()

      if (nextAvailability === 'available') {
        availability.value = 'available'
        isReady.value = true
        initializationError.value = undefined
        return
      }

      if (nextAvailability === 'downloadable') {
        availability.value = 'downloadable'
        isReady.value = false
        return
      }

      availability.value = 'unavailable'
      isReady.value = false
    }
    catch {
      availability.value = 'unavailable'
      isReady.value = false
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
      isReady.value = true
    })().catch((cause: unknown) => {
      initializationError.value = getErrorMessage(cause)
      availability.value = 'error'
      isReady.value = false
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
    isReady,
    isVisible: computed(() => availability.value !== 'checking' && availability.value !== 'unavailable'),
    initialize,
  }
}
