export function base64Encode(str: string): string {
  return btoa(str)
}

export function base64Decode(str: string): string {
  return atob(str)
}
