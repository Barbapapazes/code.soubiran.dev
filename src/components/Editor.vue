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

const { code } = useCode()
const { language } = useLanguage()

const { title } = useCodeTitle()
const isTitleEnabled = ref(false)
const editable = useTemplateRef('editable')
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
const textarea = useTemplateRef('textarea')
watch(size, () => {
  textarea.value?.autoResize()
})

const ui = computed(() => editor())
</script>

<template>
  <div :class="ui.base({ class: [props.class, props.ui?.base] })">
    <div
      v-if="!showTitle"
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
      v-else
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
    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
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
  </div>
</template>
