import type { Size } from '@/types/size'
import { params } from '@/state/params'

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
