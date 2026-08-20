<script lang="ts">
import type { SelectItem } from '@nuxt/ui'
import camera from '~icons/ph/camera'
import moon from '~icons/ph/moon'
import sparkle from '~icons/ph/sparkle'
import sun from '~icons/ph/sun'
import Watermark from '@/app/components/Watermark.vue'
import { useWebMCP } from '@/app/composables/useWebMCP'
import { createCaptureCodeTool } from '@/app/tools/captureCode'
import { createSetCodeTool } from '@/app/tools/setCode'
import { createSetCodeOptionsTool } from '@/app/tools/setCodeOptions'

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

const isOpen = ref<boolean>(false)
function open() {
  isOpen.value = true
}

const isDark = useDark()
const toggleDark = useToggle(isDark)

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

useWebMCP(setCodeTool)
useWebMCP(setCodeImageOptionsTool)
useWebMCP(captureCodeImageTool)

const sizes: SelectItem[] = [
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
]

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
  <div class="flex h-screen min-w-0 w-full">
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
          />

          <div :class="ui.toolbar({ class: props.ui?.toolbar })">
            <UFieldGroup>
              <UButton
                :icon="isDark ? moon : sun"
                color="neutral"
                variant="subtle"
                @click="() => { toggleDark() }"
              />

              <USelect
                v-model="size"
                :items="sizes"
                color="neutral"
                variant="subtle"
                :class="ui.sizeSelect({ class: props.ui?.sizeSelect })"
              />

              <USelect
                v-model="language"
                :items="languages"
                color="neutral"
                variant="subtle"
                :class="ui.languageSelect({ class: props.ui?.languageSelect })"
              />
            </UFieldGroup>

            <UFieldGroup>
              <UButton
                :icon="sparkle"
                label="Assistant"
                color="neutral"
                variant="subtle"
                @click="open"
              />

              <UButton
                :icon="camera"
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
      class="shrink-0 w-(--sidebar-width) transition-[width] duration-200 ease-linear motion-reduce:transition-none data-[state=collapsed]:w-0"
    />
  </div>
</template>
