<script lang="ts">
const editor = tv({
  slots: {
    base: 'relative p-5 bg-[var(--ui-bg-elevated)] rounded-[calc(var(--ui-radius)*4)] overflow-hidden flex',
    render: 'absolute inset-5',
    textarea: 'relative font-mono text-transparent caret-[var(--ui-text)] focus:outline-none resize-none w-full h-full',
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

const textarea = templateRef('textarea')

const { code, language, size } = useCode()
watch(size, () => {
  textarea.value?.autoResize()
})

const ui = computed(() => editor())
</script>

<template>
  <div :class="ui.base({ class: props.ui?.base })">
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
</template>
