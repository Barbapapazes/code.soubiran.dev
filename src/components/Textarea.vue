<script lang="ts">
const textarea = tv({
  base: '',
})

export interface TextareaProps {
  rows?: number
  class?: any
}
export interface TextareaEmits {}
export interface TextareaSlots {}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<TextareaProps>(), {
  rows: 1,
})
defineEmits<TextareaEmits>()
defineSlots<TextareaSlots>()

const value = defineModel<string>({ required: true })

const textareaRef = useTemplateRef('textareaRef')

function autoResize() {
  if (!textareaRef.value) {
    return
  }
  textareaRef.value.rows = props.rows
  const overflow = textareaRef.value.style.overflow
  textareaRef.value.style.overflow = 'hidden'
  const styles = window.getComputedStyle(textareaRef.value)
  const paddingTop = Number.parseInt(styles.paddingTop)
  const paddingBottom = Number.parseInt(styles.paddingBottom)
  const padding = paddingTop + paddingBottom
  const lineHeight = Number.parseInt(styles.lineHeight)
  const { scrollHeight } = textareaRef.value
  const newRows = (scrollHeight - padding) / lineHeight
  if (newRows > props.rows) {
    textareaRef.value.rows = newRows
  }
  textareaRef.value.style.overflow = overflow
}
watch(value, () => {
  nextTick(autoResize)
})

onMounted(() => {
  autoResize()
})

defineExpose({
  autoResize,
})

const ui = computed(() => textarea({ class: props.class }))
</script>

<template>
  <textarea ref="textareaRef" v-model="value" :class="ui" />
</template>
