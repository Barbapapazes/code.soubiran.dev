<script lang="ts">
import type { SelectItem } from '@nuxt/ui'
import type { Gradient } from '@/app/types/gradient'
import type { Language } from '@/app/types/language'
import camera from '~icons/ph/camera'
import moon from '~icons/ph/moon'
import sun from '~icons/ph/sun'
import Watermark from '@/app/components/Watermark.vue'

const app = tv({
  slots: {
    base: 'w-screen h-screen p-4 bg-default text-default flex flex-col items-center justify-center gap-8',
    layout: 'w-full flex flex-col gap-8',
    canvas: 'relative',
    controls: 'absolute bottom-8 inset-x-0 max-w-screen-sm mx-auto w-full flex flex-col gap-2',
    toolbar: 'flex justify-between gap-2',
    sizeSelect: 'w-28',
    languageSelect: 'w-32',
    gradientSelect: 'w-28',
  },
})

export interface AppProps {
  class?: any
  ui?: Partial<typeof app.slots>
}
export interface AppEmits {}
export interface AppSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<AppProps>()
defineEmits<AppEmits>()
defineSlots<AppSlots>()

const editor = ref<{ el?: HTMLElement }>()
const { capture: captureScreenshot } = useScreenshot(() => editor.value?.el)

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { size } = useSize()
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

const { language } = useLanguage()
const languages: SelectItem[] = (['typescript', 'markdown', 'php', 'json', 'html', 'vue'] satisfies Language[])
  .sort()
  .map(lang => ({ label: lang, value: lang }))

const { gradient } = useGradient()
const gradients: SelectItem[] = (['purple', 'blue', 'green', 'orange', 'pink', 'red'] satisfies Gradient[])
  .map(grad => ({ label: grad.charAt(0).toUpperCase() + grad.slice(1), value: grad }))

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

  return 'max-w-screen-sm'
})

const ui = computed(() => app())
</script>

<template>
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
        <div :class="ui.toolbar({ class: props.ui?.toolbar })">
          <UFieldGroup>
            <UButton
              :icon="isDark ? moon : sun"
              color="neutral"
              variant="subtle"
              @click="toggleDark()"
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

            <USelect
              v-model="gradient"
              :items="gradients"
              color="neutral"
              variant="subtle"
              :class="ui.gradientSelect({ class: props.ui?.gradientSelect })"
            />
          </UFieldGroup>

          <UButton
            :icon="camera"
            label="Capture"
            color="neutral"
            variant="solid"
            @click="captureScreenshot"
          />
        </div>
      </div>
    </div>
  </main>
</template>
