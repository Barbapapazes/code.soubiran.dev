<script lang="ts">
import type { Gradient } from '@/types/gradient'
import { gradients } from '@/types/gradient'

const editorWrapper = tv({
  base: 'p-12',
})

export interface EditorWrapperProps {
  class?: any
  gradient?: Gradient
}
export interface EditorWrapperEmits {}
export interface EditorWrapperSlots {
  default: (props: object) => any
}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<EditorWrapperProps>(), {
  gradient: 'purple',
})
defineEmits<EditorWrapperEmits>()
defineSlots<EditorWrapperSlots>()

const el = templateRef('el')
defineExpose({
  el,
})

const gradientClass = computed(() => gradients[props.gradient])
const ui = computed(() => editorWrapper({ class: [props.class, gradientClass.value] }))
</script>

<template>
  <div ref="el" :class="ui">
    <slot />
  </div>
</template>
