<script lang="ts">
const watermark = tv({
  base: 'text-sm text-[var(--ui-bg-elevated)] font-sofia',
})

export interface WatermarkProps {
  text?: string
  class?: any
}
export interface WatermarkEmits {}
export interface WatermarkSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<WatermarkProps>()
defineEmits<WatermarkEmits>()
defineSlots<WatermarkSlots>()

const { watermark: text } = useCode()

const ui = computed(() => watermark({ class: props.class }))
</script>

<template>
  <p :class="ui" v-if="text">
    {{ text }}
  </p>
</template>
