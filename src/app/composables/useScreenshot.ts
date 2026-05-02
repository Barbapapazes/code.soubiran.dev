import { domToPng } from 'modern-screenshot'

export function useScreenshot(element: MaybeRefOrGetter<any>) {
  function capture() {
    domToPng(toValue(element), { scale: 4 }).then((dataUrl) => {
      const a = document.createElement('a')
      a.download = 'screenshot.png'
      a.href = dataUrl
      a.click()
    })
  }

  return {
    capture,
  }
}
