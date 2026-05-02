import type { Gradient } from '@/app/types/gradient'
import { params } from '@/app/state/params'

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
