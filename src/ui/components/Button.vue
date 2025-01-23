<script lang="ts">
import type { LinkProps } from '@/ui/components/Link.vue'
import Avatar, { type AvatarProps } from '@/ui/components/Avatar.vue'
import Icon from '@/ui/components/Icon.vue'
import Link from '@/ui/components/Link.vue'
import { useButtonGroup } from '@/ui/composables/useButtonGroup'
import { useComponentIcons, type UseComponentIconsProps } from '@/ui/composables/useComponentIcons'
import { loading as loadingIcon } from '@/ui/icons'
import theme from '@/ui/theme/button'
import { omit } from '@/ui/utils/omit'
import { reactivePick } from '@vueuse/core'
import { useForwardProps } from 'reka-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import { computed } from 'vue'

const button = tv(theme)

type ButtonVariants = VariantProps<typeof button>

export interface ButtonProps extends LinkProps, UseComponentIconsProps {
  label?: string
  href?: string
  color?: ButtonVariants['color']
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  square?: boolean
  block?: boolean
  class?: any
  ui?: Partial<typeof button.slots>
  onClick?: ((event: MouseEvent) => void | Promise<void>)
}

export interface ButtonSlots {
  leading: (props?: object) => any
  default: (props?: object) => any
  trailing: (props?: object) => any
  loading: (props?: object) => any
}
</script>

<script setup lang="ts">
const props = defineProps<ButtonProps>()
const slots = defineSlots<ButtonSlots>()

const { orientation, size: buttonSize } = useButtonGroup<ButtonProps>(props)

const linkProps = useForwardProps(reactivePick(props, ['as', 'active', 'href', 'target', 'rel', 'onClick']))

const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(() => props)

const ui = computed(() => button({
  color: props.color,
  variant: props.variant,
  size: buttonSize.value,
  loading: props.loading,
  block: props.block,
  square: props.square || (!slots.default && !props.label),
  leading: props.leading,
  trailing: props.trailing,
  buttonGroup: orientation.value,
}))
</script>

<template>
  <Link
    :type="type"
    :disabled="disabled || loading"
    v-bind="omit(linkProps, ['type', 'disabled'])"
    :class="ui.base({ class: [props.class, props.ui?.base] })"
    raw
  >
    <slot name="leading">
      <Icon v-if="isLeading" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
      <Avatar v-else-if="!!avatar" :size="((props.ui?.leadingAvatarSize || ui.leadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.leadingAvatar({ class: props.ui?.leadingAvatar })" />
    </slot>

    <slot>
      <span v-if="label" :class="ui.label({ class: props.ui?.label })">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing">
      <Icon v-if="isTrailing" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
    </slot>

    <slot name="loading">
      <Icon v-if="loading" :name="loadingIcon" :class="ui.loadingIcon({ class: props.ui?.loadingIcon })" />
    </slot>
  </Link>
</template>
