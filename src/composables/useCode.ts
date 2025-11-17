import { params } from '@/state/params'

const code = ref('')
export function useCode() {
  code.value = base64Decode(params.code)

  watch(code, () => {
    params.code = base64Encode(code.value) || undefined
  })

  return {
    code,
  }
}
