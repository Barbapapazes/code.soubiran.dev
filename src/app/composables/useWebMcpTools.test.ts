import type { ExperimentalWebMcpTool } from '@/app/experimental/webmcp'
import type { Gradient } from '@/app/types/gradient'
import type { CodeImageLanguage, CodeImageSize } from '@/shared/code-image'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { registerWebMcpTools } from './useWebMcpTools'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('webMCP editor tools', () => {
  it('publishes parallel editor updates that complete before capture', async () => {
    const registeredTools: ExperimentalWebMcpTool[] = []
    const registerTool = vi.fn(async (tool: ExperimentalWebMcpTool) => {
      registeredTools.push(tool)
    })
    vi.stubGlobal('document', { modelContext: { registerTool } })

    const code = ref('const oldCode = true')
    const language = ref<CodeImageLanguage>('typescript')
    const size = ref<CodeImageSize>('md')
    const gradient = ref<Gradient>('purple')
    const title = ref('')
    const watermark = ref('')
    const capture = vi.fn(async () => {})

    await registerWebMcpTools({
      code,
      language,
      size,
      gradient,
      title,
      watermark,
      capture,
    }, new AbortController().signal)

    const setCode = registeredTools.find(tool => tool.name === 'set_code')
    const setOptions = registeredTools.find(tool => tool.name === 'set_code_image_options')
    const captureImage = registeredTools.find(tool => tool.name === 'capture_code_image')

    if (!setCode || !setOptions || !captureImage) {
      throw new Error('Expected all code image WebMCP tools to be registered.')
    }

    expect(setCode.description).toContain('parallel with set_code_image_options')
    expect(setOptions.description).toContain('parallel with set_code')
    expect(captureImage.description).toContain('after all requested code and image-option updates')

    await Promise.all([
      setCode.execute({ code: 'const answer = 42' }),
      setOptions.execute({ gradient: 'blue' }),
    ])
    await captureImage.execute({})

    expect(code.value).toBe('const answer = 42')
    expect(gradient.value).toBe('blue')
    expect(capture).toHaveBeenCalledOnce()
  })
})
