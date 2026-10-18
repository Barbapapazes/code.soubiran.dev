import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { useEditorImage } from './useEditorImage'

const readers: MockReader[] = []
class MockReader {
  result: string | null = null
  onload?: () => void
  onerror?: () => void
  onabort?: () => void
  readAsDataURL() {
    readers.push(this)
  }
  finish(data: string) {
    this.result = data
    this.onload?.()
  }
}

const file = (type = 'image/png', size = 100) => ({ type, size }) as File
const track = vi.fn()
const decode = vi.fn<() => Promise<void>>()

beforeEach(() => {
  readers.length = 0
  track.mockClear()
  decode.mockReset().mockResolvedValue(undefined)
  vi.stubGlobal('useAnalytics', () => ({ track }))
  vi.stubGlobal('FileReader', MockReader)
  vi.stubGlobal('Image', class {
    src = ''
    decode = decode
  })
})

afterEach(() => vi.unstubAllGlobals())

async function upload(image: ReturnType<typeof useEditorImage>, data = 'data:image/png;base64,example') {
  const pending = image.load([file()])
  readers[readers.length - 1]!.finish(data)
  await pending
}

describe('local editor images', () => {
  it('loads a decoded image and clears it without tracking its contents', async () => {
    const image = useEditorImage()
    await upload(image)
    expect(image.source.value).toBe('data:image/png;base64,example')
    expect(image.loading.value).toBe(false)
    expect(decode).toHaveBeenCalledOnce()
    image.clear()
    expect(image.source.value).toBeUndefined()
    expect(track.mock.calls).toEqual([
      ['editor_image_load', {}],
      ['editor_image_clear', {}],
    ])
  })

  it('rejects unsupported, multiple, empty, and oversized selections without replacing the image', async () => {
    const image = useEditorImage()
    await upload(image)
    for (const files of [[], [file('text/plain')], [file(), file()], [file('image/png', 5 * 1024 * 1024 + 1)]]) {
      await image.load(files)
      expect(image.error.value).not.toBe('')
      expect(image.source.value).toBe('data:image/png;base64,example')
    }
    expect(readers).toHaveLength(1)
  })

  it('preserves the current image on read or decode failure', async () => {
    const image = useEditorImage()
    await upload(image)
    const pending = image.load([file()])
    readers[1]!.onerror?.()
    await pending
    expect(image.error.value).not.toBe('')
    decode.mockRejectedValueOnce(new Error('Invalid image'))
    await upload(image, 'data:image/png;base64,broken')
    expect(image.source.value).toBe('data:image/png;base64,example')
    expect(image.error.value).not.toBe('')
    expect(image.loading.value).toBe(false)
  })

  it('ignores stale reads after a newer selection or clearing', async () => {
    const image = useEditorImage()
    const first = image.load([file()])
    await upload(image, 'data:image/png;base64,new')
    readers[0]!.finish('data:image/png;base64,old')
    await first
    expect(image.source.value).toBe('data:image/png;base64,new')

    const pending = image.load([file()])
    image.clear()
    readers[2]!.finish('data:image/png;base64,cancelled')
    await pending
    expect(image.source.value).toBeUndefined()
    expect(image.loading.value).toBe(false)
    expect(image.error.value).toBe('')
  })
})
