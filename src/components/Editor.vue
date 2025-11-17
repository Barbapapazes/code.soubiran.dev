<script lang="ts">
const editor = tv({
  slots: {
    base: 'border border-12 border-white/30 rounded-3xl',
    wrapper: 'relative p-5 bg-elevated rounded-xl overflow-hidden flex',
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

const { size } = useSize()
const textarea = templateRef('textarea')
watch(size, () => {
  textarea.value?.autoResize()
})

const ui = computed(() => editor())
</script>

<template>
  <div :class="ui.base({ class: [props.class, props.ui?.base] })">
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
