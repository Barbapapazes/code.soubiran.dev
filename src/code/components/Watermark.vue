<script lang="ts">
import { EditableArea, EditableInput, EditablePreview, EditableRoot } from 'reka-ui'

const watermark = tv({
  slots: {
    base: 'text-sm text-[var(--ui-bg-elevated)] font-sofia',
    area: '',
    preview: 'min-h-4 min-w-10',
  },
})

export interface WatermarkProps {
  text?: string
  class?: any
  ui?: Partial<typeof watermark.slots>
}
export interface WatermarkEmits {}
export interface WatermarkSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<WatermarkProps>()
defineEmits<WatermarkEmits>()
defineSlots<WatermarkSlots>()

const { watermark: text } = useWatermark()

const ui = computed(() => watermark())
</script>

<template>
  <EditableRoot v-model="text" :class="ui.base({ class: [props.class, props.ui?.base] })" placeholder="" auto-resize>
    <EditableArea :class="ui.area({ class: props.ui?.area })">
      <EditablePreview as="div" :class="ui.preview({ class: props.ui?.preview })" />
      <EditableInput />
    </EditableArea>
  </EditableRoot>
</template>
