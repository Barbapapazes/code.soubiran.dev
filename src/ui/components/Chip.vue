<script lang="ts">
import theme from '@/ui/theme/chip'
import { Primitive, Slot } from 'reka-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import { computed } from 'vue'

const chip = tv(theme)

type ChipVariants = VariantProps<typeof chip>

export interface ChipProps {
  as?: any
  text?: string | number
  color?: ChipVariants['color']
  size?: ChipVariants['size']
  position?: ChipVariants['position']
  inset?: boolean
  standalone?: boolean
  class?: any
  ui?: Partial<typeof chip.slots>
}

export interface ChipEmits {
  (e: 'update:show', payload: boolean): void
}

export interface ChipSlots {
  default: (props?: object) => any
  content: (props?: object) => any
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<ChipProps>(), {
  inset: false,
  standalone: false,
})
defineSlots<ChipSlots>()

const show = defineModel<boolean>('show', { default: true })

const ui = computed(() => chip({
  color: props.color,
  size: props.size,
  position: props.position,
  inset: props.inset,
  standalone: props.standalone,
}))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <Slot v-bind="$attrs">
      <slot />
    </Slot>

    <span v-if="show" :class="ui.base({ class: props.ui?.base })">
      <slot name="content">
        {{ text }}
      </slot>
    </span>
  </Primitive>
</template>
