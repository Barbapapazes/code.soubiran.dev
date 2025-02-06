import type { Size } from '@/code/types/size'
import { params } from '@/code/state/params'

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
