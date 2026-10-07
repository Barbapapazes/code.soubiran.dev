<script lang="ts">
import type { CodeImageSize } from '#shared/code-image'
import type { useEditor } from '../composables/useEditor'
import Editor from './Editor.vue'
import EditorWrapper from './EditorWrapper.vue'
import GradientSelector from './GradientSelector.vue'
import Watermark from './Watermark.vue'

const editorWorkspace = tv({
  slots: {
    root: 'relative h-screen min-w-0 flex-1 p-4 bg-default text-default flex flex-col items-center justify-center gap-8',
    layout: 'w-full flex flex-col gap-8',
    canvas: 'relative',
    controls: 'absolute bottom-8 inset-x-0 max-w-screen-sm mx-auto w-full flex flex-col gap-6',
    toolbar: 'flex justify-between gap-2',
    sizeSelect: 'w-28',
    languageSelect: 'w-32',
    gradientSelector: '',
  },
})

export interface EditorWorkspaceProps {
  editor: ReturnType<typeof useEditor>
  class?: any
  ui?: Partial<typeof editorWorkspace.slots>
}
export interface EditorWorkspaceEmits {}
export interface EditorWorkspaceSlots {
  actions: (props: object) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<EditorWorkspaceProps>()
defineEmits<EditorWorkspaceEmits>()
defineSlots<EditorWorkspaceSlots>()

const { track } = useAnalytics()
const { size, language, languages, gradient, capture } = props.editor
const wrapper = useTemplateRef('wrapper')
defineExpose({ el: computed(() => wrapper.value?.el) })

const isDark = useDark()
const toggleDark = useToggle(isDark)
function toggleColorMode() {
  toggleDark()
  track('editor_color_mode_change', { mode: isDark.value ? 'dark' : 'light' })
}

const sizes = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
  { label: 'Extra Large', value: 'xl' },
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

const ui = computed(() => editorWorkspace())
</script>

<template>
  <main :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.layout({ class: [props.ui?.layout, maxWidthClass] })">
      <EditorWrapper
        ref="wrapper"
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
            <slot name="actions" />

            <UButton
              icon="i-ph-camera"
              label="Capture"
              color="neutral"
              variant="solid"
              @click="capture"
            />
          </UFieldGroup>
        </div>
      </div>
    </div>
  </main>
</template>
