<script lang="ts">
import type { AvatarProps } from '@/ui/components/Avatar.vue'
import type { InputHTMLAttributes } from 'vue'
import Avatar from '@/ui/components/Avatar.vue'
import Icon from '@/ui/components/Icon.vue'
import { useButtonGroup } from '@/ui/composables/useButtonGroup'
import { useComponentIcons, type UseComponentIconsProps } from '@/ui/composables/useComponentIcons'
import { useFormField } from '@/ui/composables/useFormField'
import theme from '@/ui/theme/input'
import { looseToNumber } from '@/ui/utils/loose-to-number'
import { Primitive } from 'reka-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import { computed, onMounted, ref } from 'vue'

const input = tv(theme)

type InputVariants = VariantProps<typeof input>

export interface InputProps extends UseComponentIconsProps {
  as?: any
  id?: string
  name?: string
  type?: InputHTMLAttributes['type']
  placeholder?: string
  color?: InputVariants['color']
  variant?: InputVariants['variant']
  size?: InputVariants['size']
  required?: boolean
  autocomplete?: InputHTMLAttributes['autocomplete']
  autofocus?: boolean
  autofocusDelay?: number
  disabled?: boolean
  highlight?: boolean
  class?: any
  ui?: Partial<typeof input.slots>
}

export interface InputEmits {
  (e: 'update:modelValue', payload: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'change', event: Event): void
}

export interface InputSlots {
  leading: (props?: object) => any
  default: (props?: object) => any
  trailing: (props?: object) => any
}
</script>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  autocomplete: 'off',
  autofocusDelay: 0,
})
const emits = defineEmits<InputEmits>()
const slots = defineSlots<InputSlots>()

const [modelValue, modelModifiers] = defineModel<string | number>()

const { size: formGroupSize, id } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(props)

const inputSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => input({
  type: props.type as InputVariants['type'],
  color: props.color,
  variant: props.variant,
  size: inputSize?.value,
  loading: props.loading,
  highlight: props.highlight,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value,
}))

const inputRef = ref<HTMLInputElement | null>(null)

function autoFocus() {
  if (props.autofocus) {
    inputRef.value?.focus()
  }
}

// Custom function to handle the v-model properties
function updateInput(value: string) {
  if (modelModifiers.trim) {
    value = value.trim()
  }

  if (modelModifiers.number || props.type === 'number') {
    value = looseToNumber(value)
  }

  modelValue.value = value
}

function onInput(event: Event) {
  if (!modelModifiers.lazy) {
    updateInput((event.target as HTMLInputElement).value)
  }
}

function onChange(event: Event) {
  const value = (event.target as HTMLInputElement).value

  if (modelModifiers.lazy) {
    updateInput(value)
  }

  // Update trimmed input so that it has same behavior as native input https://github.com/vuejs/core/blob/5ea8a8a4fab4e19a71e123e4d27d051f5e927172/packages/runtime-dom/src/directives/vModel.ts#L63
  if (modelModifiers.trim) {
    (event.target as HTMLInputElement).value = value.trim()
  }

  emits('change', event)
}

function onBlur(event: FocusEvent) {
  emits('blur', event)
}

defineExpose({
  inputRef,
})

onMounted(() => {
  setTimeout(() => {
    autoFocus()
  }, props.autofocusDelay)
})
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <input
      :id="id"
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      :class="ui.base({ class: props.ui?.base })"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      v-bind="$attrs"
      @input="onInput"
      @blur="onBlur"
      @change="onChange"
    >

    <slot />

    <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
      <slot name="leading">
        <Icon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
        <Avatar v-else-if="!!avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
      </slot>
    </span>

    <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
      <slot name="trailing">
        <Icon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
      </slot>
    </span>
  </Primitive>
</template>
