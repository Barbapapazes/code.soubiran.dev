<script lang="ts">
import { useLLM } from '../composables/useLLM'

const assistantToggle = tv({
  slots: { base: '' },
})

export interface AssistantToggleProps {
  class?: any
  ui?: Partial<typeof assistantToggle.slots>
}
export interface AssistantToggleEmits {
  open: []
}
export interface AssistantToggleSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<AssistantToggleProps>()
const emit = defineEmits<AssistantToggleEmits>()
defineSlots<AssistantToggleSlots>()

const { track } = useAnalytics()
const { availability, checkAvailability, initialize, downloadProgress } = useLLM()
onMounted(async () => {
  await checkAvailability()
})

async function initializeAssistant() {
  track('assistant_initialize_start', {})
  await initialize()
  track(availability.value === 'available' ? 'assistant_initialize_success' : 'assistant_initialize_failure', {})
}

const ui = computed(() => assistantToggle())
</script>

<template>
  <UButton
    v-if="availability === 'downloadable'"
    icon="i-ph-sparkle"
    label="Initialize Assistant"
    color="neutral"
    variant="subtle"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="initializeAssistant()"
  />
  <UButton
    v-else-if="availability === 'downloading'"
    loading
    :label="`Downloading Assistant (${downloadProgress}%)`"
    color="neutral"
    variant="subtle"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  />
  <UButton
    v-else-if="availability !== 'unavailable' && availability !== 'checking'"
    icon="i-ph-sparkle"
    label="Assistant"
    color="neutral"
    variant="subtle"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @click="emit('open')"
  />
</template>
