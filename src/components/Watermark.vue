<script lang="ts" setup>
import { EditableArea, EditableInput, EditablePreview, EditableRoot } from 'reka-ui'

const props = defineProps<{
  text?: string
  class?: any
}>()

const { watermark: text } = useWatermark()
</script>

<template>
  <EditableRoot v-model="text" class="text-sm text-(--ui-bg-elevated) font-sofia" :class="[props.class]" placeholder="" auto-resize>
    <EditableArea>
      <EditablePreview as="div" class="min-h-4 min-w-10" />
      <EditableInput />
    </EditableArea>
  </EditableRoot>
</template>
