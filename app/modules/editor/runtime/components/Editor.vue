<script lang="ts">
import { EditableArea, EditableInput, EditablePreview, EditableRoot } from 'reka-ui'
import { useCode } from '../composables/useCode'
import { useCodeTitle } from '../composables/useCodeTitle'
import { useLanguage } from '../composables/useLanguage'
import { useSize } from '../composables/useSize'
import Render from './Render.vue'
import Textarea from './Textarea.vue'

const editor = tv({
  slots: {
    base: 'group relative border border-12 border-white/30 rounded-3xl overflow-hidden',
    actions:
      'opacity-0 group-hover:opacity-100 absolute top-0 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-100 ease-in',
    title: 'text-center py-3 px-5 text-sm font-medium font-sofia text-muted bg-elevated border-b border-accented h-11',
    wrapper: 'relative p-5 bg-elevated overflow-hidden flex',
    render: 'absolute inset-5',
    textarea:
      'relative font-mono text-transparent caret-(--ui-text-muted) focus:outline-none resize-none w-full h-full',
  },
})

export interface EditorProps {
  image?: string
  class?: any
  ui?: Partial<typeof editor.slots>
}
export interface EditorEmits {
  imageDrop: [files: File[]]
  imageClear: []
}
export interface EditorSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EditorProps>()
const emit = defineEmits<EditorEmits>()
defineSlots<EditorSlots>()

const { track } = useAnalytics()
const dragDepth = ref(0)
function onDragEnter(event: DragEvent) {
  if (event.dataTransfer?.types.includes('Files')) {
    event.preventDefault()
    dragDepth.value++
  }
}
function onDragOver(event: DragEvent) {
  if (event.dataTransfer?.types.includes('Files')) {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }
}
function onDrop(event: DragEvent) {
  dragDepth.value = 0
  if (event.dataTransfer?.types.includes('Files')) {
    event.preventDefault()
    emit('imageDrop', Array.from(event.dataTransfer.files))
  }
}
const editable = useTemplateRef('editable')
const textarea = useTemplateRef('textarea')

const { code } = useCode()
const { language } = useLanguage()

const { title } = useCodeTitle()
const isTitleEnabled = ref(false)
const showTitle = computed(() => title.value || isTitleEnabled.value)
function enableTitle() {
  track('editor_title_enable', {})
  isTitleEnabled.value = true
  nextTick(() => {
    editable.value?.edit()
  })
}
function onTitleSubmit() {
  track('editor_title_submit', { enabled: Boolean(title.value) })
  if (!title.value) {
    isTitleEnabled.value = false
  }
}

const { size } = useSize()
watch(size, () => {
  textarea.value?.autoResize()
})

const ui = computed(() => editor())
</script>

<template>
  <div
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="dragDepth = Math.max(0, dragDepth - 1)"
    @drop="onDrop"
    @dragend="dragDepth = 0"
  >
    <div v-if="!showTitle" :class="ui.actions({ class: props.ui?.actions })">
      <UButton color="neutral" variant="link" size="xs" label="Title" @click="enableTitle" />
    </div>

    <EditableRoot
      v-else
      ref="editable"
      v-model="title"
      placeholder=""
      auto-resize
      :class="ui.title({ class: props.ui?.title })"
      @submit="onTitleSubmit"
    >
      <EditableArea>
        <EditablePreview as="div" class="min-h-4 min-w-10" />
        <EditableInput />
      </EditableArea>
    </EditableRoot>
    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div v-if="props.image" class="group/image relative w-full">
        <img
          :src="props.image"
          alt="Uploaded image"
          class="block w-full max-h-[60vh] object-contain"
        >
        <UButton
          icon="i-ph-x"
          aria-label="Remove image and return to code"
          color="neutral"
          variant="solid"
          size="xs"
          class="absolute top-2 right-2 rounded-full opacity-0 transition-opacity group-hover/image:opacity-100 focus-visible:opacity-100"
          data-editor-control
          @click="emit('imageClear')"
        />
      </div>
      <template v-else>
        <Suspense>
          <Render :code="code" :language="language" :class="ui.render({ class: props.ui?.render })" />
        </Suspense>

        <Textarea
          ref="textarea"
          v-model="code"
          autocomplete="off"
          autocapitalize="off"
          autocorrect="off"
          autofocus
          spellcheck="false"
          :class="ui.textarea({ class: props.ui?.textarea })"
        />
      </template>
    </div>
    <div
      v-if="dragDepth > 0"
      role="status"
      class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center border-2 border-dashed border-primary bg-elevated/90 text-highlighted"
    >
      Drop one image here
    </div>
  </div>
</template>
