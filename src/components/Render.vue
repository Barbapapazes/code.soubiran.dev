<script lang="ts">
import type { Language } from '@/types/language'

const render = tv({
  base: '',
})

export interface RenderProps {
  language: Language
  code: string
  class?: any
}
export interface RenderEmits {}
export interface RenderSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<RenderProps>()
defineEmits<RenderEmits>()
defineSlots<RenderSlots>()

const { html } = await useShiki(() => props.code, () => props.language)

const ui = computed(() => render({ class: props.class }))
</script>

<template>
  <div :class="ui" v-html="html" />
</template>
