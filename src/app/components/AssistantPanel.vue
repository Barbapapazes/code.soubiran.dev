<script lang="ts">
import { useChat } from '@ai-sdk/vue'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import { DirectChatTransport, getToolName, isDynamicToolUIPart, isReasoningUIPart, isStepCount, isTextUIPart, ToolLoopAgent } from 'ai'
import arrowClockwiseIcon from '~icons/ph/arrow-clockwise'
import paperPlaneTiltIcon from '~icons/ph/paper-plane-tilt'
import stopIcon from '~icons/ph/stop'
import AssistantMarkdown from '@/app/components/AssistantMarkdown'
import { createWebMCPClient } from '@/app/experimental/createWebMCPClient'

const assistantPanel = tv({
  slots: {
    state: 'm-auto flex max-w-sm flex-col items-center gap-3 text-center',
    messageList: 'flex flex-col gap-5',
    message: 'max-w-[85%] rounded-lg px-3 py-2 text-sm leading-6 space-y-1',
    userMessage: 'ml-auto whitespace-pre-wrap bg-elevated',
    assistantMessage: 'mr-auto w-full max-w-none',
    loading: 'px-3 pt-2 text-sm leading-6',
    error: 'text-error',
    empty: 'text-muted',
  },
})

interface AssistantPanelProps {
  open: boolean
  class?: any
  ui?: Partial<Omit<typeof assistantPanel.slots, 'root'>>
}
interface AssistantPanelEmits {}
interface AssistantPanelSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<AssistantPanelProps>()
defineEmits<AssistantPanelEmits>()
defineSlots<AssistantPanelSlots>()

const { getModel } = useLLM()

const transport = shallowRef<DirectChatTransport | null>()
const {
  clearError,
  error,
  messages,
  sendMessage,
  status,
  stop,
} = useChat(() => ({ transport: transport.value! }))

onMounted(async () => {
  const client = createWebMCPClient()
  const tools = await client.tools()

  const agent = new ToolLoopAgent({
    instructions: `You are the local assistant for code.soubiran.dev, a tool that turns raw source code into clean, beautifully styled images for sharing on social media, blogs, or presentations. Help users edit or capture the code.`,
    model: getModel(),
    temperature: 0.4,
    tools,
    stopWhen: isStepCount(6),
  })
  transport.value = new DirectChatTransport({ agent })
})

const open = defineModel('open', { default: false })

const input = ref('')
async function submit() {
  if (!input.value.trim().length) {
    return
  }

  if (status.value !== 'ready') {
    return
  }

  sendMessage({ text: input.value })
  input.value = ''
}

function clear() {
  clearError()
  input.value = ''
  messages.value = []
}

watch([() => open.value], async ([isPanelOpen]) => {
  if (!isPanelOpen) {
    return
  }

  await nextTick()
  document.querySelector<HTMLTextAreaElement>('[data-local-assistant-prompt] textarea')?.focus()
})

const ui = computed(() => assistantPanel())
</script>

<template>
  <USidebar
    v-model:open="open"
    side="right"
    rail
    title="Local assistant"
    close
    :style="{ '--sidebar-width': '24rem' }"
    :ui="{ footer: 'p-0', actions: 'gap-0.5', container: 'left-auto!' }"
    :class="props.class"
  >
    <template #actions>
      <UButton
        label="Clear"
        color="neutral"
        variant="ghost"
        size="xs"
        :disabled="messages.length === 0"
        @click="clear()"
      />
    </template>

    <template #default>
      <div
        v-if="status === 'ready' && messages.length === 0"
        :class="ui.state({ class: [props.ui?.state, props.ui?.empty] })"
      >
        <p class="font-medium text-default">
          Ask me anything
        </p>
        <p>
          Responses stay on this device and disappear when this page reloads.
        </p>
      </div>

      <div v-else :class="ui.messageList({ class: props.ui?.messageList })">
        <article
          v-for="message in messages"
          :key="message.id"
          :class="ui.message({ class: [
            props.ui?.message,
            message.role === 'user' ? [ui.userMessage(), props.ui?.userMessage] : [ui.assistantMessage(), props.ui?.assistantMessage],
          ] })"
        >
          <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
            <p
              v-if="message.role === 'user' && isTextUIPart(part)"
            >
              {{ part.text }}
            </p>

            <template v-else-if="message.role === 'assistant'">
              <UChatReasoning
                v-if="isReasoningUIPart(part)"
                :text="part.text"
                :streaming="isPartStreaming(part)"
                icon="i-ph-brain"
                chevron="leading"
              >
                <Suspense>
                  <AssistantMarkdown
                    :value="part.text"
                    :streaming="isPartStreaming(part)"
                  />
                </Suspense>
              </UChatReasoning>

              <Suspense
                v-else-if="isTextUIPart(part) && part.text.length > 0"
              >
                <AssistantMarkdown
                  :value="part.text"
                  :streaming="isPartStreaming(part)"
                />
              </Suspense>

              <UChatTool
                v-else-if="isDynamicToolUIPart(part)"
                :text="getToolName(part)"
                :state="part.state"
                :streaming="isToolStreaming(part)"
              />
            </template>
          </template>
        </article>

        <p
          v-if="status === 'error' && error"
          :class="ui.error({ class: props.ui?.error })"
        >
          {{ error.message }}
        </p>

        <UChatShimmer
          v-if="status === 'submitted'"
          text="Loading..."
          :spread="5"
          :class="ui.loading({ class: props.ui?.loading })"
        />
      </div>
    </template>

    <template #footer>
      <UChatPrompt
        v-model="input"
        data-local-assistant-prompt
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
              :icon="status === 'ready' ? paperPlaneTiltIcon : status === 'error' ? arrowClockwiseIcon : stopIcon"
              :aria-label="status === 'streaming' ? 'Stop response' : 'Send message'"
              color="neutral"
              size="sm"
              :disabled="status !== 'ready' || !input.trim().length"
              @click="status === 'streaming' ? stop() : submit()"
            />
          </div>
        </template>
      </UChatPrompt>
    </template>
  </USidebar>
</template>
