import { ref } from 'vue'

const imageAccept = 'image/png,image/jpeg,image/webp,image/gif,image/avif,image/svg+xml'
const imageTypes = new Set(imageAccept.split(','))
const maxImageSize = 5 * 1024 * 1024

/** Images are local to this workspace, never placed in URLs or analytics. */
export function useEditorImage() {
  const source = ref<string>()
  const error = ref('')
  const loading = ref(false)
  const { track } = useAnalytics()
  let request = 0

  function clear() {
    request++
    if (source.value) {
      track('editor_image_clear', {})
    }
    source.value = undefined
    error.value = ''
    loading.value = false
  }

  async function load(files: File[]) {
    const current = ++request
    error.value = ''
    loading.value = false
    const file = files[0]
    if (files.length !== 1 || !file || !imageTypes.has(file.type)) {
      error.value = 'Choose one PNG, JPEG, WebP, GIF, AVIF, or SVG image.'
      return
    }
    if (file.size > maxImageSize) {
      error.value = 'Choose an image smaller than 5 MB.'
      return
    }

    loading.value = true
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result)
          } else {
            reject(new Error('Image could not be read'))
          }
        }
        reader.onerror = reader.onabort = () => reject(new Error('Image could not be read'))
        reader.readAsDataURL(file)
      })
      // Decode before replacing the current content; corrupt files leave it intact.
      const preview = new Image()
      preview.src = data
      await preview.decode()
      if (current === request) {
        source.value = data
        track('editor_image_load', {})
      }
    } catch {
      if (current === request) {
        error.value = 'This image could not be opened. Try another file.'
      }
    } finally {
      if (current === request) {
        loading.value = false
      }
    }
  }

  return { source, error, loading, load, clear }
}
