import type { FormFieldProps } from '@/ui/components/FormField.vue'
import type { GetObjectField } from '@/ui/types/utils'
import type { ComputedRef, InjectionKey, Ref } from 'vue'

export const inputIdInjectionKey: InjectionKey<Ref<string>> = Symbol('vue-ui.input-id')

export interface FormFieldInjectedOptions<T> {
  size?: GetObjectField<T, 'size'>
}

export const formFieldInjectionKey: InjectionKey<ComputedRef<FormFieldInjectedOptions<FormFieldProps>>> = Symbol('vue-ui.form-field')
