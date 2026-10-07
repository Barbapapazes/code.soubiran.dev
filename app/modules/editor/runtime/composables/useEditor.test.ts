import type { SearchParams } from '../types/search-params'
import { domToPng } from 'modern-screenshot'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, reactive, ref, toValue, watch } from 'vue'
import { base64Decode, base64Encode } from '#shared/base64'

vi.mock('modern-screenshot', () => ({ domToPng: vi.fn() }))

describe('editor module capabilities', () => {
  let scope: ReturnType<typeof effectScope>
  const track = vi.fn()
  const params = reactive<SearchParams>({})

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    scope = effectScope()
    vi.stubGlobal('ref', ref)
    vi.stubGlobal('watch', watch)
    vi.stubGlobal('toValue', toValue)
    vi.stubGlobal('useUrlSearchParams', () => params)
    vi.stubGlobal('useAnalytics', () => ({ track }))
  })

  afterEach(() => {
    scope.stop()
    vi.unstubAllGlobals()
    for (const key of Object.keys(params)) {
      delete params[key as keyof SearchParams]
    }
  })

  it('hydrates URL settings and exposes tools that update the same state', async () => {
    Object.assign(params, {
      code: base64Encode('const initial = true'),
      language: 'typescript',
      size: 'lg',
      gradient: 'blue',
      title: 'Example',
      watermark: 'Author',
    })
    const { useEditor } = await import('./useEditor')
    const editor = scope.run(() => useEditor(() => undefined))!

    expect(editor.code.value).toBe('const initial = true')
    expect(editor.language.value).toBe('typescript')
    expect(editor.size.value).toBe('lg')
    expect(editor.gradient.value).toBe('blue')
    expect(editor.title.value).toBe('Example')
    expect(editor.watermark.value).toBe('Author')
    expect(editor.tools.map(tool => tool.name)).toEqual(['set_code', 'set_code_options', 'capture_code'])

    await editor.tools.find(tool => tool.name === 'set_code')!.execute({ code: 'echo "hello";' })
    await editor.tools.find(tool => tool.name === 'set_code_options')!.execute({
      language: 'php',
      size: 'sm',
      gradient: 'sunset',
      title: '',
      watermark: '',
    })
    await nextTick()

    expect(editor.code.value).toBe('echo "hello";')
    expect(base64Decode(params.code)).toBe(editor.code.value)
    expect(params).toMatchObject({ language: 'php', size: 'sm', gradient: 'sunset' })
    expect(params.title).toBeUndefined()
    expect(params.watermark).toBeUndefined()
  })

  it('captures the current workspace element through the shared capture tool', async () => {
    const element = ref<HTMLElement>()
    const anchor = { click: vi.fn(), download: '', href: '' }
    vi.stubGlobal('document', { createElement: vi.fn(() => anchor) })
    vi.mocked(domToPng).mockResolvedValue('data:image/png;base64,image')
    const { useEditor } = await import('./useEditor')
    const editor = scope.run(() => useEditor(() => element.value))!

    // The template ref is populated after useEditor runs, not at setup time.
    element.value = { id: 'workspace' } as HTMLElement
    await editor.tools.find(tool => tool.name === 'capture_code')!.execute({})

    expect(domToPng).toHaveBeenCalledWith(element.value, { scale: 4 })
    expect(anchor.download).toBe('screenshot.png')
    expect(anchor.href).toBe('data:image/png;base64,image')
    expect(anchor.click).toHaveBeenCalledOnce()
    expect(track.mock.calls).toEqual([['capture_start', {}], ['capture_success', {}]])
  })
})
