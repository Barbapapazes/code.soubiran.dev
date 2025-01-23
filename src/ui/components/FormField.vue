<script lang="ts">
import { type FormFieldInjectedOptions, formFieldInjectionKey, inputIdInjectionKey } from '@/ui/keys/form-field'
import theme from '@/ui/theme/form-field'
import { Label, Primitive } from 'reka-ui'
import { tv, type VariantProps } from 'tailwind-variants'
import { computed, provide, ref, useId } from 'vue'

const formField = tv(theme)

type FormFieldVariants = VariantProps<typeof formField>

export interface FormFieldProps {
  as?: any
  label?: string
  description?: string
  help?: string
  error?: string
  hint?: string
  size?: FormFieldVariants['size']
  required?: boolean
  class?: any
  ui?: Partial<typeof formField.slots>
}

export interface FormFieldSlots {
  label: (props: { label?: string }) => any
  hint: (props: { hint?: string }) => any
  description: (props: { description?: string }) => any
  help: (props: { help?: string }) => any
  error: (props: { error?: string | boolean }) => any
  default: (props: { error?: string | boolean }) => any
}
</script>

<script setup lang="ts">
const props = defineProps<FormFieldProps>()
const slots = defineSlots<FormFieldSlots>()

const ui = computed(() => formField({
  size: props.size,
  required: props.required,
}))

const id = ref(useId())

provide(inputIdInjectionKey, id)

provide(formFieldInjectionKey, computed(() => ({
  size: props.size,
}) as FormFieldInjectedOptions<FormFieldProps>))
</script>

<template>
  <Primitive :as="as" :class="ui.root({ class: [props.class, props.ui?.root] })">
    <div :class="ui.wrapper({ class: props.ui?.wrapper })">
      <div v-if="label || !!slots.label" :class="ui.labelWrapper({ class: props.ui?.labelWrapper })">
        <Label :for="id" :class="ui.label({ class: props.ui?.label })">
          <slot name="label" :label="label">
            {{ label }}
          </slot>
        </Label>
        <span v-if="hint || !!slots.hint" :class="ui.hint({ class: props.ui?.hint })">
          <slot name="hint" :hint="hint">
            {{ hint }}
          </slot>
        </span>
      </div>

      <p v-if="description || !!slots.description" :class="ui.description({ class: props.ui?.description })">
        <slot name="description" :description="description">
          {{ description }}
        </slot>
      </p>
    </div>

    <div :class="[(label || !!slots.label || description || !!slots.description) && ui.container({ class: props.ui?.container })]">
      <slot :error="error" />

      <p v-if="(typeof error === 'string' && error) || !!slots.error" :class="ui.error({ class: props.ui?.error })">
        <slot name="error" :error="error">
          {{ error }}
        </slot>
      </p>
      <p v-else-if="help || !!slots.help" :class="ui.help({ class: props.ui?.help })">
        <slot name="help" :help="help">
          {{ help }}
        </slot>
      </p>
    </div>
  </Primitive>
</template>
