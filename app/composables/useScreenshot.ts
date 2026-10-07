import { domToPng } from 'modern-screenshot'

export function useScreenshot(element: MaybeRefOrGetter<any>) {
  async function capture() {
    const dataUrl = await domToPng(toValue(element), { scale: 4 })
    const a = document.createElement('a')
    a.download = 'screenshot.png'
    a.href = dataUrl
    a.click()
  }

  return {
    capture,
  }
}
