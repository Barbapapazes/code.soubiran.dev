import type { BrowserAIChatLanguageModel } from '@browser-ai/core'
import { browserAI, doesBrowserSupportBrowserAI } from '@browser-ai/core'
import { computed, ref } from 'vue'

export type LocalAssistantAvailability
  = | 'checking'
    | 'unavailable'
    | 'available'
    | 'downloadable'
    | 'downloading'
    | 'preparing'
    | 'error'

const availability = ref<LocalAssistantAvailability>('checking')
const downloadProgress = ref<number>()
const initializationError = ref<string>()
const isOpen = ref(false)
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

    if (nextAvailability === 'available-after-download') {
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
    const session = await getModel().createSessionWithProgress((progress) => {
      downloadProgress.value = Math.round(progress * 100)
      availability.value = progress >= 1 ? 'preparing' : 'downloading'
    })

    model.value = session
    downloadProgress.value = 100
    availability.value = 'available'
    isReady.value = true
  })().catch((error: unknown) => {
    initializationError.value = getErrorMessage(error)
    availability.value = 'error'
    isReady.value = false
  }).finally(() => {
    initializationPromise = undefined
  })

  return initializationPromise
}

async function open() {
  isOpen.value = true

  if (availability.value === 'downloadable' || availability.value === 'downloading') {
    await initialize()
  }
}

async function retryInitialization() {
  await initialize()
}

export function useLocalAssistant() {
  return {
    availability,
    downloadProgress,
    initializationError,
    isOpen,
    isReady,
    isVisible: computed(() => availability.value !== 'checking' && availability.value !== 'unavailable'),
    checkAvailability,
    getModel,
    open,
    retryInitialization,
  }
}
