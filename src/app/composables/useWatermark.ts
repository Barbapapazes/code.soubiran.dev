import { params } from '@/app/state/params'

const watermark = ref('')
export function useWatermark() {
  watermark.value = params.watermark || ''

  watch(watermark, () => {
    params.watermark = watermark.value || undefined
  })

  return {
    watermark,
  }
}
