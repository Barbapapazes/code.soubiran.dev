<script lang="ts">
import { tv } from 'tailwind-variants'
</script>

<script lang="ts" setup>
import { isPartStreaming } from '@nuxt/ui/utils/ai'
import { isDynamicToolUIPart, isReasoningUIPart, isTextUIPart } from 'ai'
import { computed, nextTick, ref, watch } from 'vue'
import arrowClockwise from '~icons/ph/arrow-clockwise'
import paperPlaneTilt from '~icons/ph/paper-plane-tilt'
import stop from '~icons/ph/stop'
import { useAssistantChat } from '@/app/composables/useAssistantChat'
import { useLocalAssistant } from '@/app/composables/useLocalAssistant'
import AssistantMarkdown from './AssistantMarkdown'

const props = defineProps<AssistantPanelProps>()

defineEmits<AssistantPanelEmits>()

defineSlots<AssistantPanelSlots>()

const assistantPanel = tv({
  slots: {
    content: 'flex min-h-0 flex-1 flex-col overflow-y-auto p-4',
    state: 'm-auto flex max-w-sm flex-col items-center gap-3 text-center',
    progress: 'w-full',
    messageList: 'flex flex-col gap-5',
    message: 'max-w-[85%] rounded-lg px-3 py-2 text-sm leading-6',
    userMessage: 'ml-auto whitespace-pre-wrap bg-elevated',
    assistantMessage: 'mr-auto w-full max-w-none',
    error: 'text-error',
    empty: 'text-muted',
  },
})

interface AssistantPanelProps {
  class?: any
  ui?: Partial<Omit<typeof assistantPanel.slots, 'root'>>
}
interface AssistantPanelEmits {}
interface AssistantPanelSlots {}

const assistant = useLocalAssistant()
const chat = useAssistantChat()
const input = ref('')

const isStreaming = computed(() => chat.status.value === 'streaming' || chat.status.value === 'submitted')
const canSend = computed(() => assistant.isReady.value && input.value.trim().length > 0 && !isStreaming.value)
const isPreparing = computed(() => assistant.availability.value === 'downloading' || assistant.availability.value === 'downloadable' || assistant.availability.value === 'preparing')

function getToolOutput(output: unknown) {
  const content = output && typeof output === 'object' && 'content' in output
    ? output.content ?? output
    : output

  if (typeof content === 'string') {
    return content.trim() || undefined
  }

  if (Array.isArray(content)) {
    const text = content
      .map(item => item && typeof item === 'object' && 'text' in item && typeof item.text === 'string' ? item.text : '')
      .filter(Boolean)
      .join('\n')

    return text || undefined
  }

  try {
    return JSON.stringify(content, null, 2)
  }
  catch {
    return String(content)
  }
}

function isPanelOpen() {
  return assistant.isOpen.value
}

function updatePanelOpen(value: boolean) {
  assistant.isOpen.value = value
}

function submit() {
  if (!canSend.value) {
    return
  }

  const text = input.value
  input.value = ''
  void chat.send(text)
}

watch([assistant.isOpen, assistant.isReady], async ([isPanelOpen, isReady]) => {
  if (!isPanelOpen || !isReady) {
    return
  }

  await nextTick()
  document.querySelector<HTMLTextAreaElement>('[data-local-assistant-prompt] textarea')?.focus()
})

const ui = computed(() => assistantPanel())
</script>

<template>
  <USidebar
    :open="isPanelOpen()"
    side="right"
    rail
    title="Local assistant"
    close
    :style="{ '--sidebar-width': '24rem' }"
    :ui="{ footer: 'p-0', actions: 'gap-0.5', container: 'left-auto!' }"
    :class="props.class"
    @update:open="updatePanelOpen"
  >
    <template #actions>
      <UButton
        v-if="chat.messages.value.length"
        label="Clear"
        color="neutral"
        variant="ghost"
        size="xs"
        @click="chat.clear"
      />
    </template>

    <template #default>
      <div :class="ui.content({ class: props.ui?.content })">
        <div v-if="isPreparing" :class="ui.state({ class: props.ui?.state })">
          <p class="font-medium">
            {{ assistant.availability.value === 'preparing' ? 'Preparing local model…' : 'Downloading local model…' }}
          </p>
          <UProgress
            :model-value="assistant.downloadProgress.value"
            :indeterminate="assistant.availability.value === 'preparing'"
            :class="ui.progress({ class: props.ui?.progress })"
          />
          <p class="text-sm text-muted">
            {{ assistant.downloadProgress.value === undefined ? 'Waiting for the browser…' : `${assistant.downloadProgress.value}%` }}
          </p>
        </div>

        <div v-else-if="assistant.availability.value === 'error'" :class="ui.state({ class: props.ui?.state })">
          <p :class="ui.error({ class: props.ui?.error })">
            {{ assistant.initializationError.value }}
          </p>
          <UButton label="Try again" :icon="arrowClockwise" color="neutral" @click="assistant.retryInitialization" />
        </div>

        <div v-else-if="chat.messages.value.length === 0" :class="ui.state({ class: [props.ui?.state, props.ui?.empty] })">
          <p class="font-medium text-default">
            Ask me anything
          </p>
          <p>
            Responses stay on this device and disappear when this page reloads.
          </p>
          <p v-if="chat.webMcpTools.availability.value === 'unavailable'" class="text-xs">
            Browser actions are unavailable in this browser.
          </p>
        </div>

        <div v-else :class="ui.messageList({ class: props.ui?.messageList })">
          <article
            v-for="message in chat.messages.value"
            :key="message.id"
            :class="ui.message({ class: [
              props.ui?.message,
              message.role === 'user' ? [ui.userMessage(), props.ui?.userMessage] : [ui.assistantMessage(), props.ui?.assistantMessage],
            ] })"
          >
            <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
              <p v-if="message.role === 'user' && isTextUIPart(part)">
                {{ part.text }}
              </p>
              <UChatReasoning
                v-else-if="message.role === 'assistant' && isReasoningUIPart(part)"
                :text="part.text"
                :streaming="isPartStreaming(part)"
                icon="i-ph-brain"
                chevron="leading"
              >
                <Suspense>
                  <AssistantMarkdown :value="part.text" :streaming="isPartStreaming(part)" />

                  <template #fallback>
                    <p class="whitespace-pre-wrap">
                      {{ part.text }}
                    </p>
                  </template>
                </Suspense>
              </UChatReasoning>
              <Suspense v-else-if="message.role === 'assistant' && isTextUIPart(part) && part.text.length > 0">
                <AssistantMarkdown :value="part.text" :streaming="isPartStreaming(part)" />

                <template #fallback>
                  <p class="whitespace-pre-wrap">
                    {{ part.text }}
                  </p>
                </template>
              </Suspense>
              <UChatTool
                v-else-if="message.role === 'assistant' && isDynamicToolUIPart(part)"
                :text="part.toolName"
                :state="part.state"
              >
                <template v-if="part.state === 'output-available' && getToolOutput(part.output)" #default>
                  <pre
                    class="text-xs text-muted whitespace-pre-wrap break-all rounded-md border border-muted bg-muted p-2 max-h-64 overflow-y-auto"
                    v-text="getToolOutput(part.output)"
                  />
                </template>
              </UChatTool>
            </template>
          </article>

          <UChatReasoning v-if="chat.status.value === 'submitted'" streaming icon="i-ph-brain" />
          <p v-if="chat.error.value" :class="ui.error({ class: props.ui?.error })">
            {{ chat.error.value.message }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <UChatPrompt
        v-model="input"
        data-local-assistant-prompt
        :disabled="!assistant.isReady.value"
        :placeholder="assistant.isReady.value ? 'Ask a question' : 'Local model is not ready'"
        :rows="1"
        autoresize
        class="rounded-none"
        @submit.prevent="submit"
      >
        <template #footer>
          <div class="pl-2 w-full flex items-center justify-between">
            <span class="text-xs text-dimmed flex flex-row gap-1">
              Line break <UKbd class="font-sans" size="sm">⇧</UKbd><UKbd class="font-sans" size="sm">↵</UKbd>
            </span>

            <UButton
              :icon="isStreaming ? stop : paperPlaneTilt"
              :aria-label="isStreaming ? 'Stop response' : 'Send message'"
              color="neutral"
              size="sm"
              :disabled="!isStreaming && !canSend"
              @click="isStreaming ? chat.stop() : submit()"
            />
          </div>
        </template>
      </UChatPrompt>
    </template>
  </USidebar>
</template>
