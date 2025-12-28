<script lang="ts">
import { EditableArea, EditableInput, EditablePreview, EditableRoot } from 'reka-ui'

const editor = tv({
  slots: {
    base: 'group relative border border-12 border-white/30 rounded-3xl overflow-hidden',
    actions: 'opacity-0 group-hover:opacity-100 absolute top-0 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-100 ease-in',
    title: 'text-center py-3 px-5 text-sm font-medium font-sofia text-muted bg-elevated border-b border-accented h-11',
    wrapper: 'relative p-5 bg-elevated overflow-hidden flex',
    render: 'absolute inset-5',
    textarea: 'relative font-mono text-transparent caret-(--ui-text-muted) focus:outline-none resize-none w-full h-full',
    imageWrapper: 'relative p-5 bg-elevated overflow-hidden flex items-center justify-center min-h-[300px]',
    image: 'max-w-full max-h-full object-contain',
    dropzone: 'absolute inset-0 border-2 border-dashed border-(--ui-border-accented) bg-(--ui-bg-elevated/50) flex items-center justify-center z-20',
  },
})

export interface EditorProps {
  class?: any
  ui?: Partial<typeof editor.slots>
}
export interface EditorEmits {}
export interface EditorSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<EditorProps>()
defineEmits<EditorEmits>()
defineSlots<EditorSlots>()

const editable = useTemplateRef('editable')
const textarea = useTemplateRef('textarea')

const { code } = useCode()
const { language } = useLanguage()
const { imageData } = useImageData()

// Determine if we're in image mode
const isImageMode = computed(() => !!imageData.value)

const { title } = useCodeTitle()
const isTitleEnabled = ref(false)
const showTitle = computed(() => title.value || isTitleEnabled.value)
function enableTitle() {
  isTitleEnabled.value = true
  nextTick(() => {
    editable.value?.edit()
  })
}
function onTitleSubmit() {
  if (!title.value) {
    isTitleEnabled.value = false
  }
}

const { size } = useSize()
watch(size, () => {
  textarea.value?.autoResize()
})

// Drag and drop functionality
const isDragging = ref(false)

function handleDragEnter(e: DragEvent) {
  e.preventDefault()
  isDragging.value = true
}

function handleDragLeave(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isDragging.value = false

  const files = e.dataTransfer?.files
  if (!files || files.length === 0)
    return

  const file = files[0]
  if (!file.type.startsWith('image/')) {
    // TODO: Show error notification that only image files are supported
    return
  }

  const reader = new FileReader()
  reader.onload = (event) => {
    const result = event.target?.result
    if (typeof result === 'string') {
      imageData.value = result
      // Note: Code is preserved and will be restored when image is cleared
    }
  }
  reader.readAsDataURL(file)
}

function clearImage() {
  imageData.value = ''
}

const ui = computed(() => editor())
</script>

<template>
  <div
    :class="ui.base({ class: [props.class, props.ui?.base] })"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <div
      v-if="!showTitle && !isImageMode"
      :class="ui.actions({ class: props.ui?.actions })"
    >
      <UButton
        color="neutral"
        variant="link"
        size="xs"
        label="Title"
        @click="enableTitle"
      />
    </div>

    <EditableRoot
      v-else-if="showTitle"
      ref="editable"
      v-model="title"
      placeholder=""
      auto-resize
      :class="ui.title({ class: props.ui?.title })" @submit="onTitleSubmit"
    >
      <EditableArea>
        <EditablePreview as="div" class="min-h-4 min-w-10" />
        <EditableInput />
      </EditableArea>
    </EditableRoot>

    <!-- Image Mode -->
    <div v-if="isImageMode" :class="ui.imageWrapper({ class: props.ui?.imageWrapper })">
      <div :class="ui.actions({ class: props.ui?.actions })">
        <UButton
          color="neutral"
          variant="link"
          size="xs"
          label="Clear Image"
          @click="clearImage"
        />
      </div>
      <Image
        :src="imageData"
        :class="ui.image({ class: props.ui?.image })"
      />
    </div>

    <!-- Code Mode -->
    <div v-else :class="ui.wrapper({ class: props.ui?.wrapper })">
      <Suspense>
        <Render
          :code="code"
          :language="language"
          :class="ui.render({ class: props.ui?.render })"
        />
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
    </div>

    <!-- Drag and Drop Overlay -->
    <div v-if="isDragging" :class="ui.dropzone({ class: props.ui?.dropzone })">
      <p class="text-lg font-medium text-muted">
        Drop image here
      </p>
    </div>
  </div>
</template>
