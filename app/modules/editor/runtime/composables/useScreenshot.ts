import { domToPng } from 'modern-screenshot'

export function useScreenshot(element: MaybeRefOrGetter<any>) {
  const { track } = useAnalytics()

  async function capture() {
    track('capture_start', {})
    try {
      const dataUrl = await domToPng(toValue(element), {
        scale: 4,
        filter: (node) => !(node.nodeType === 1 && (node as Element).hasAttribute('data-editor-control')),
      })
      const a = document.createElement('a')
      a.download = 'screenshot.png'
      a.href = dataUrl
      a.click()
      track('capture_success', {})
    } catch (error) {
      track('capture_failure', {})
      throw error
    }
  }

  return {
    capture,
  }
}
