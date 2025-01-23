<script lang="ts">
import type { AvatarProps } from '@/ui/components/Avatar.vue'
import type { ChipProps } from '@/ui/components/Chip.vue'
import type { InputProps } from '@/ui/components/Input.vue'
import type { MaybeArrayOfArray, MaybeArrayOfArrayItem, SelectItemKey, SelectModelValue, SelectModelValueEmits } from '@/ui/types/utils'
import type { AcceptableValue, SelectArrowProps, SelectContentProps, SelectRootEmits, SelectRootProps } from 'reka-ui'
import Avatar from '@/ui/components/Avatar.vue'
import Chip from '@/ui/components/Chip.vue'
import Icon from '@/ui/components/Icon.vue'
import { useButtonGroup } from '@/ui/composables/useButtonGroup'
import { useComponentIcons, type UseComponentIconsProps } from '@/ui/composables/useComponentIcons'
import { useFormField } from '@/ui/composables/useFormField'
import { check as checkIcon, chevronDown as chevronDownIcon } from '@/ui/icons'
import theme from '@/ui/theme/select'
import { compare } from '@/ui/utils/compare'
import { reactivePick } from '@vueuse/core'
import { defu } from 'defu'
import { SelectItem as RSelectItem, SelectArrow, SelectContent, SelectGroup, SelectItemIndicator, SelectItemText, SelectLabel, SelectPortal, SelectRoot, SelectSeparator, SelectTrigger, SelectViewport, useForwardPropsEmits } from 'reka-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import { computed, toRef } from 'vue'

const select = tv(theme)

export interface SelectItem {
  label?: string
  icon?: string
  avatar?: AvatarProps
  chip?: ChipProps
  type?: 'label' | 'separator' | 'item'
  value?: string
  disabled?: boolean
}

type SelectVariants = VariantProps<typeof select>

export interface SelectProps<T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<SelectItem | AcceptableValue | boolean> = MaybeArrayOfArray<SelectItem | AcceptableValue | boolean>, V extends SelectItemKey<T> | undefined = undefined, M extends boolean = false> extends Omit<SelectRootProps<T>, 'dir' | 'multiple' | 'modelValue' | 'defaultValue' | 'by'>, UseComponentIconsProps {
  id?: string
  placeholder?: string
  color?: SelectVariants['color']
  variant?: SelectVariants['variant']
  size?: SelectVariants['size']
  trailingIcon?: string
  selectedIcon?: string
  content?: Omit<SelectContentProps, 'as' | 'asChild' | 'forceMount'>
  arrow?: boolean | Omit<SelectArrowProps, 'as' | 'asChild'>
  portal?: boolean
  items?: I
  defaultValue?: SelectModelValue<T, V, M, T extends { value: infer U } ? U : never>
  modelValue?: SelectModelValue<T, V, M, T extends { value: infer U } ? U : never>
  multiple?: M & boolean
  highlight?: boolean
  class?: any
  ui?: Partial<typeof select.slots>
}

export type SelectEmits<T, V, M extends boolean> = Omit<SelectRootEmits<T>, 'update:modelValue'> & {
  change: [payload: Event]
  blur: [payload: FocusEvent]
  focus: [payload: FocusEvent]
} & SelectModelValueEmits<T, V, M, T extends { value: infer U } ? U : never>

type SlotProps<T> = (props: { item: T, index: number }) => any

export interface SelectSlots<T, M extends boolean> {
  'leading': (props: { modelValue?: M extends true ? AcceptableValue[] : AcceptableValue, open: boolean, ui: any }) => any
  'default': (props: { modelValue?: M extends true ? AcceptableValue[] : AcceptableValue, open: boolean }) => any
  'trailing': (props: { modelValue?: M extends true ? AcceptableValue[] : AcceptableValue, open: boolean, ui: any }) => any
  'item': SlotProps<T>
  'item-leading': SlotProps<T>
  'item-label': SlotProps<T>
  'item-trailing': SlotProps<T>
}
</script>

<script setup lang="ts" generic="T extends MaybeArrayOfArrayItem<I>, I extends MaybeArrayOfArray<SelectItem | AcceptableValue | boolean> = MaybeArrayOfArray<SelectItem | AcceptableValue | boolean>, V extends SelectItemKey<T> | undefined = undefined, M extends boolean = false">
const props = withDefaults(defineProps<SelectProps<T, I, V, M>>(), {
  valueKey: 'value' as never,
  labelKey: 'label' as never,
  portal: true,
})
const emits = defineEmits<SelectEmits<T, V, M>>()
const slots = defineSlots<SelectSlots<T, M>>()

const rootProps = useForwardPropsEmits(reactivePick(props, 'modelValue', 'defaultValue', 'open', 'defaultOpen', 'disabled', 'autocomplete', 'required', 'multiple'), emits)
const contentProps = toRef(() => defu(props.content, { side: 'bottom', sideOffset: 8, collisionPadding: 8, position: 'popper' }) as SelectContentProps)
const arrowProps = toRef(() => props.arrow as SelectArrowProps)

const { id, size: formGroupSize } = useFormField<InputProps>(props)
const { orientation, size: buttonGroupSize } = useButtonGroup<InputProps>(props)
const { isLeading, isTrailing, leadingIconName, trailingIconName } = useComponentIcons(toRef(() => defu(props, { trailingIcon: chevronDownIcon })))

const selectSize = computed(() => buttonGroupSize.value || formGroupSize.value)

const ui = computed(() => select({
  color: props.color,
  variant: props.variant,
  size: selectSize?.value,
  loading: props.loading,
  highlight: props.highlight,
  leading: isLeading.value || !!props.avatar || !!slots.leading,
  trailing: isTrailing.value || !!slots.trailing,
  buttonGroup: orientation.value,
}))

const groups = computed(() => props.items?.length ? (Array.isArray(props.items[0]) ? props.items : [props.items]) as SelectItem[][] : [])

const items = computed(() => groups.value.flatMap(group => group) as T[])

function displayValue(value?: AcceptableValue | AcceptableValue[]): string | undefined {
  if (props.multiple && Array.isArray(value)) {
    return value.map(v => displayValue(v)).filter(Boolean).join(', ')
  }

  const item = items.value.find(item => compare(typeof item === 'object' ? (item as SelectItem).value : item, value as any))
  return item && (typeof item === 'object' ? item.label : item)
}

function onUpdate(value: any) {
  // @ts-expect-error - 'target' does not exist in type 'EventInit'
  const event = new Event('change', { target: { value } })
  emits('change', event)
}
function onUpdateOpen(value: boolean) {
  if (!value) {
    emits('blur', new FocusEvent('blur'))
  }
  else {
    emits('focus', new FocusEvent('focus'))
  }
}
</script>

<!-- eslint-disable vue/no-template-shadow -->
<template>
  <SelectRoot
    :id="id"
    v-slot="{ modelValue, open }"
    v-bind="rootProps"
    :name="name"
    :autocomplete="autocomplete"
    :disabled="disabled"
    @update:model-value="onUpdate"
    @update:open="onUpdateOpen"
  >
    <SelectTrigger :class="ui.base({ class: [props.class, props.ui?.base] })">
      <span v-if="isLeading || !!avatar || !!slots.leading" :class="ui.leading({ class: props.ui?.leading })">
        <slot name="leading" :model-value="(modelValue as M extends true ? AcceptableValue[] : AcceptableValue)" :open="open" :ui="ui">
          <Icon v-if="isLeading && leadingIconName" :name="leadingIconName" :class="ui.leadingIcon({ class: props.ui?.leadingIcon })" />
          <Avatar v-else-if="!!avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
        </slot>
      </span>

      <slot :model-value="(modelValue as M extends true ? AcceptableValue[] : AcceptableValue)" :open="open">
        <template v-for="displayedModelValue in [displayValue(modelValue)]" :key="displayedModelValue">
          <span v-if="displayedModelValue" :class="ui.value({ class: props.ui?.value })">
            {{ displayedModelValue }}
          </span>
          <span v-else :class="ui.placeholder({ class: props.ui?.placeholder })">
            {{ placeholder ?? '&nbsp;' }}
          </span>
        </template>
      </slot>

      <span v-if="isTrailing || !!slots.trailing" :class="ui.trailing({ class: props.ui?.trailing })">
        <slot name="trailing" :model-value="(modelValue as M extends true ? AcceptableValue[] : AcceptableValue)" :open="open" :ui="ui">
          <Icon v-if="trailingIconName" :name="trailingIconName" :class="ui.trailingIcon({ class: props.ui?.trailingIcon })" />
        </slot>
      </span>
    </SelectTrigger>

    <SelectPortal :disabled="!portal">
      <SelectContent :class="ui.content({ class: props.ui?.content })" v-bind="contentProps">
        <SelectViewport :class="ui.viewport({ class: props.ui?.viewport })">
          <SelectGroup v-for="(group, groupIndex) in groups" :key="`group-${groupIndex}`" :class="ui.group({ class: props.ui?.group })">
            <template v-for="(item, index) in group" :key="`group-${groupIndex}-${index}`">
              <SelectLabel v-if="item?.type === 'label'" :class="ui.label({ class: props.ui?.label })">
                {{ item.label }}
              </SelectLabel>

              <SelectSeparator v-else-if="item?.type === 'separator'" :class="ui.separator({ class: props.ui?.separator })" />

              <RSelectItem
                v-else
                :class="ui.item({ class: props.ui?.item })"
                :disabled="item.disabled"
                :value="typeof item === 'object' ? item.value as any : item"
              >
                <slot name="item" :item="(item as T)" :index="index">
                  <slot name="item-leading" :item="(item as T)" :index="index">
                    <Icon v-if="item.icon" :name="item.icon" :class="ui.itemLeadingIcon({ class: props.ui?.itemLeadingIcon })" />
                    <Avatar v-else-if="item.avatar" :size="((props.ui?.itemLeadingAvatarSize || ui.itemLeadingAvatarSize()) as AvatarProps['size'])" v-bind="item.avatar" :class="ui.itemLeadingAvatar({ class: props.ui?.itemLeadingAvatar })" />
                    <Chip
                      v-else-if="item.chip"
                      :size="((props.ui?.itemLeadingChipSize || ui.itemLeadingChipSize()) as ChipProps['size'])"
                      inset
                      standalone
                      v-bind="item.chip"
                      :class="ui.itemLeadingChip({ class: props.ui?.itemLeadingChip })"
                    />
                  </slot>

                  <SelectItemText :class="ui.itemLabel({ class: props.ui?.itemLabel })">
                    <slot name="item-label" :item="(item as T)" :index="index">
                      {{ typeof item === 'object' ? item.label : item }}
                    </slot>
                  </SelectItemText>

                  <span :class="ui.itemTrailing({ class: props.ui?.itemTrailing })">
                    <slot name="item-trailing" :item="(item as T)" :index="index" />

                    <SelectItemIndicator as-child>
                      <Icon :name="checkIcon" :class="ui.itemTrailingIcon({ class: props.ui?.itemTrailingIcon })" />
                    </SelectItemIndicator>
                  </span>
                </slot>
              </RSelectItem>
            </template>
          </SelectGroup>
        </SelectViewport>

        <SelectArrow v-if="!!arrow" v-bind="arrowProps" :class="ui.arrow({ class: props.ui?.arrow })" />
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
