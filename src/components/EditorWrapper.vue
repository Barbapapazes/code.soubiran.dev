<script lang="ts">
const editorWrapper = tv({
  base: 'p-12 bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
})

export interface EditorWrapperProps {
  class?: any
}
export interface EditorWrapperEmits {}
export interface EditorWrapperSlots {
  default: (props: object) => any
}
</script>

<script lang="ts" setup>
const props = defineProps<EditorWrapperProps>()
defineEmits<EditorWrapperEmits>()
defineSlots<EditorWrapperSlots>()

const el = templateRef('el')
defineExpose({
  el,
})

const ui = computed(() => editorWrapper({ class: props.class }))
</script>

<template>
  <div ref="el" :class="ui">
    <slot />
  </div>
</template>
