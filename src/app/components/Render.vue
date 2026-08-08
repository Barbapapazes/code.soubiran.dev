<script lang="ts">
import type { CodeImageLanguage } from '@/shared/code-image'

const render = tv({
  slots: {
    base: 'w-full h-full',
  },
})

export interface RenderProps {
  language: CodeImageLanguage
  code: string
  class?: any
  ui?: Partial<typeof render.slots>
}
export interface RenderEmits {}
export interface RenderSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<RenderProps>()
defineEmits<RenderEmits>()
defineSlots<RenderSlots>()

const { html } = await useShiki(() => props.code, () => props.language)

const ui = computed(() => render())
</script>

<template>
  <div :class="ui.base({ class: [props.ui?.base, props.class] })" v-html="html" />
</template>
