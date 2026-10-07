<script lang="ts">
import type { CodeImageSize } from '#shared/code-image'
import { onMounted } from 'vue'
import Watermark from '~/components/Watermark.vue'
import { useWebMCP } from '~/composables/useWebMCP'
import { createCaptureCodeTool } from '~/tools/captureCode'
import { createSetCodeTool } from '~/tools/setCode'
import { createSetCodeOptionsTool } from '~/tools/setCodeOptions'

const app = tv({
  slots: {
    base: 'relative h-screen min-w-0 flex-1 p-4 bg-default text-default flex flex-col items-center justify-center gap-8',
    layout: 'w-full flex flex-col gap-8',
    canvas: 'relative',
    controls: 'absolute bottom-8 inset-x-0 max-w-screen-sm mx-auto w-full flex flex-col gap-6',
    toolbar: 'flex justify-between gap-2',
    sizeSelect: 'w-28',
    languageSelect: 'w-32',
    gradientSelector: '',
  },
})

interface AppProps {
  class?: any
  ui?: Partial<typeof app.slots>
}
interface AppEmits {}
interface AppSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<AppProps>()
defineEmits<AppEmits>()
defineSlots<AppSlots>()

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

const isOpen = ref<boolean>(false)
function open() {
  isOpen.value = true
}

const isDark = useDark()
const toggleDark = useToggle(isDark)
function toggleColorMode() {
  toggleDark()
  track('editor_color_mode_change', { mode: isDark.value ? 'dark' : 'light' })
}

const editor = ref<{ el?: HTMLElement }>()
const { capture: captureScreenshot } = useScreenshot(() => editor.value?.el)

const { code } = useCode()
const { title } = useCodeTitle()
const { watermark } = useWatermark()
const { size } = useSize()
const { language, languages } = useLanguage()
const { gradient } = useGradient()

const setCodeTool = createSetCodeTool(code)
const setCodeImageOptionsTool = createSetCodeOptionsTool({
  language,
  size,
  gradient,
  title,
  watermark,
})
const captureCodeImageTool = createCaptureCodeTool(captureScreenshot)

const assistantTools: WebMCP.ModelContextTool[] = [setCodeTool, setCodeImageOptionsTool, captureCodeImageTool]
useWebMCP(setCodeTool)
useWebMCP(setCodeImageOptionsTool)
useWebMCP(captureCodeImageTool)

const sizes = [
  {
    label: 'Small',
    value: 'sm',
  },
  {
    label: 'Medium',
    value: 'md',
  },
  {
    label: 'Large',
    value: 'lg',
  },
  {
    label: 'Extra Large',
    value: 'xl',
  },
] satisfies { label: string, value: CodeImageSize }[]

const maxWidthClass = computed(() => {
  switch (size.value) {
    case 'sm':
      return 'max-w-screen-sm'
    case 'md':
      return 'max-w-screen-md'
    case 'lg':
      return 'max-w-screen-lg'
    case 'xl':
      return 'max-w-screen-xl'
  }

  throw new Error(`Unknown size: ${size.value}`)
})

const ui = computed(() => app())
</script>

<template>
  <UApp>
    <main :class="ui.base({ class: [props.ui?.base, props.class] })">
      <div :class="ui.layout({ class: [props.ui?.layout, maxWidthClass] })">
        <EditorWrapper
          ref="editor"
          :gradient="gradient"
          :class="ui.canvas({ class: props.ui?.canvas })"
        >
          <Editor class="shadow-lg" />

          <Watermark class="absolute inset-x-0 bottom-6 text-center translate-y-1/2" />
        </EditorWrapper>

        <div :class="ui.controls({ class: props.ui?.controls })">
          <GradientSelector
            v-model="gradient"
            :class="ui.gradientSelector({ class: props.ui?.gradientSelector })"
            @update:model-value="track('editor_gradient_change', { gradient: $event })"
          />

          <div :class="ui.toolbar({ class: props.ui?.toolbar })">
            <UFieldGroup>
              <UButton
                :icon="isDark ? 'i-ph-moon' : 'i-ph-sun'"
                aria-label="Toggle color mode"
                color="neutral"
                variant="subtle"
                @click="toggleColorMode"
              />

              <USelect
                v-model="size"
                :items="sizes"
                aria-label="Image size"
                color="neutral"
                variant="subtle"
                :class="ui.sizeSelect({ class: props.ui?.sizeSelect })"
                @update:model-value="track('editor_size_change', { size: $event })"
              />

              <USelect
                v-model="language"
                :items="languages"
                aria-label="Code language"
                color="neutral"
                variant="subtle"
                :class="ui.languageSelect({ class: props.ui?.languageSelect })"
                @update:model-value="track('editor_language_change', { language: $event })"
              />
            </UFieldGroup>

            <UFieldGroup>
              <UButton
                v-if="availability === 'downloadable'"
                icon="i-ph-sparkle"
                label="Initialize Assistant"
                color="neutral"
                variant="subtle"
                @click="initializeAssistant()"
              />
              <UButton
                v-else-if="availability === 'downloading'"
                loading
                :label="`Downloading Assistant (${downloadProgress}%)`"
                color="neutral"
                variant="subtle"
              />
              <UButton
                v-else-if="availability !== 'unavailable' && availability !== 'checking'"
                icon="i-ph-sparkle"
                label="Assistant"
                color="neutral"
                variant="subtle"
                @click="open"
              />

              <UButton
                icon="i-ph-camera"
                label="Capture"
                color="neutral"
                variant="solid"
                @click="captureScreenshot"
              />
            </UFieldGroup>
          </div>
        </div>
      </div>
    </main>

    <AssistantPanel
      v-model:open="isOpen"
      :tools="assistantTools"
      class="shrink-0 w-(--sidebar-width) transition-[width] duration-200 ease-linear motion-reduce:transition-none data-[state=collapsed]:w-0"
    />
  </UApp>
</template>
