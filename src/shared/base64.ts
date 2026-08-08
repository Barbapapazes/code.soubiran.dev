const textEncoder = new TextEncoder()
const textDecoder = new TextDecoder()

function bytesToBinaryString(bytes: Uint8Array): string {
  const chunkSize = 0x8000
  let binary = ''

  for (let start = 0; start < bytes.length; start += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(start, start + chunkSize))
  }

  return binary
}

export function base64Encode(value: string = ''): string {
  return base64EncodeBytes(textEncoder.encode(value))
}

export function base64EncodeBytes(bytes: Uint8Array): string {
  return btoa(bytesToBinaryString(bytes))
}

export function base64Decode(value: string = ''): string {
  const binary = atob(value)
  const bytes = Uint8Array.from(binary, character => character.codePointAt(0) ?? 0)

  return textDecoder.decode(bytes)
}
