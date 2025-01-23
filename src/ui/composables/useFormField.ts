import type { GetObjectField } from '@/ui/types/utils'
import { formFieldInjectionKey, inputIdInjectionKey } from '@/ui/keys/form-field'
import { computed, inject } from 'vue'

interface Props<T> {
  id?: string
  size?: GetObjectField<T, 'size'>
}

export function useFormField<T>(props?: Props<T>) {
  const formField = inject(formFieldInjectionKey, undefined)
  const inputId = inject(inputIdInjectionKey, undefined)

  if (inputId && props?.id) {
    inputId.value = props?.id
  }

  return {
    id: computed(() => props?.id ?? inputId?.value),
    size: computed(() => props?.size ?? formField?.value.size),
  }
}
