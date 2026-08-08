import { params } from '@/app/state/params'
import { base64Decode, base64Encode } from '@/shared/base64'

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
