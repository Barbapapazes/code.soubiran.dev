<script lang="ts">
import { EditableArea, EditableInput, EditablePreview, EditableRoot } from 'reka-ui'

const watermark = tv({
  slots: {
    base: 'text-sm text-(--ui-bg-elevated) font-sofia',
  },
})

export interface WatermarkProps {
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
  <EditableRoot
    v-model="text"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    placeholder=""
    auto-resize
  >
    <EditableArea>
      <EditablePreview as="div" class="min-h-4 min-w-10" />
      <EditableInput />
    </EditableArea>
  </EditableRoot>
</template>
