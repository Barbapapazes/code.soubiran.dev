import { params } from '@/state/params'

const imageData = ref<string>('')

export function useImageData() {
  imageData.value = params.image || ''

  watch(imageData, () => {
    params.image = imageData.value || undefined
  })

  return {
    imageData,
  }
}
