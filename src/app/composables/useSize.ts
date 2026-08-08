import type { CodeImageSize } from '@/shared/code-image'
import { params } from '@/app/state/params'

const size = ref<CodeImageSize>('md')
export function useSize() {
  size.value = params.size || 'md'

  watch(size, () => {
    params.size = size.value || undefined
  })

  return {
    size,
  }
}
