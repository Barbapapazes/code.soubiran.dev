import { params } from '@/state/params'

const title = ref('')
export function useCodeTitle() {
  title.value = params.title || ''

  watch(title, () => {
    params.title = title.value || undefined
  })

  return {
    title,
  }
}
