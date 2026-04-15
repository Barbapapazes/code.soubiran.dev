<script lang="ts">
import type { Language } from '@/types/language'

const render = tv({
  slots: {
    base: 'w-full h-full',
  },
})

export interface RenderProps {
  language: Language
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
