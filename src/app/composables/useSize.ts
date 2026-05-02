import type { Size } from '@/app/types/size'
import { params } from '@/app/state/params'

const size = ref<Size>('md')
export function useSize() {
  size.value = params.size || 'md'

  watch(size, () => {
    params.size = size.value || undefined
  })

  return {
    size,
  }
}
