<script lang="ts">
import type { Gradient } from '@/app/types/gradient'
import check from '~icons/ph/check'
import { gradientNames, gradients, gradientValues } from '@/app/types/gradient'

const gradientSelector = tv({
  slots: {
    base: 'flex flex-wrap items-center justify-center gap-2',
    swatch: 'relative size-6 shrink-0 rounded-full cursor-pointer transition-transform focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white hover:scale-110',
    icon: 'absolute inset-0 m-auto size-3.5 text-white drop-shadow-sm',
  },
})

export interface GradientSelectorProps {
  class?: any
  modelValue: Gradient
  ui?: Partial<typeof gradientSelector.slots>
}
export interface GradientSelectorEmits {
  'update:modelValue': [gradient: Gradient]
}
export interface GradientSelectorSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<GradientSelectorProps>()
const emit = defineEmits<GradientSelectorEmits>()
defineSlots<GradientSelectorSlots>()

const ui = computed(() => gradientSelector())
</script>

<template>
  <div
    :class="ui.base({ class: [props.ui?.base, props.class] })"
    role="group"
    aria-label="Background gradient"
  >
    <UTooltip
      v-for="gradient in gradientValues"
      :key="gradient"
      :text="gradientNames[gradient]"
    >
      <button
        type="button"
        :class="ui.swatch({ class: [props.ui?.swatch, gradients[gradient]] })"
        :aria-label="`${gradientNames[gradient]} gradient`"
        :aria-pressed="gradient === modelValue"
        @click="emit('update:modelValue', gradient)"
      >
        <component
          :is="check"
          v-if="gradient === modelValue"
          :class="ui.icon({ class: props.ui?.icon })"
          aria-hidden="true"
        />
      </button>
    </UTooltip>
  </div>
</template>
