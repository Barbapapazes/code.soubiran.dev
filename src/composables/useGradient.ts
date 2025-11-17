import type { Gradient } from '@/types/gradient'
import { params } from '@/state/params'

const gradient = ref<Gradient>('purple')
export function useGradient() {
  gradient.value = params.gradient || 'purple'

  watch(gradient, () => {
    params.gradient = gradient.value || undefined
  })

  return {
    gradient,
  }
}
