import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { createCaptureCodeTool } from '~/tools/captureCode'
import { createSetCodeTool } from '~/tools/setCode'
import { createSetCodeOptionsTool } from '~/tools/setCodeOptions'
import { createAssistantTools } from './createAssistantTools'

describe('createAssistantTools', () => {
  it('edits, configures, and captures code without browser WebMCP', async () => {
    const code = ref('')
    const options = {
      language: ref<'typescript'>('typescript'),
      size: ref<'md'>('md'),
      gradient: ref<'blue'>('blue'),
      title: ref(''),
      watermark: ref(''),
    }
    const capture = vi.fn(async () => {})
    const tools = createAssistantTools([
      createSetCodeTool(code),
      createSetCodeOptionsTool(options),
      createCaptureCodeTool(capture),
    ])
    const context = { toolCallId: 'test', messages: [], context: {} }

    expect(Object.keys(tools)).toEqual(['set_code', 'set_code_options', 'capture_code'])
    await tools.set_code!.execute!({ code: 'const answer = 42' }, context)
    await tools.set_code_options!.execute!({ title: 'Answer' }, context)
    await tools.capture_code!.execute!({}, context)

    expect(code.value).toBe('const answer = 42')
    expect(options.title.value).toBe('Answer')
    expect(capture).toHaveBeenCalledOnce()
    await expect(tools.set_code!.execute!({ code: 42 }, context)).rejects.toThrow()
  })

  it('forwards the execution abort signal', async () => {
    const execute = vi.fn(async () => 'done')
    const controller = new AbortController()
    const tools = createAssistantTools([{ name: 'test', description: 'Test', execute }])

    await tools.test!.execute!({}, { toolCallId: 'test', messages: [], context: {}, abortSignal: controller.signal })

    expect(execute).toHaveBeenCalledWith({}, { signal: controller.signal })
    expect(tools.test!.inputSchema).toMatchObject({ jsonSchema: { type: 'object', properties: {} } })
  })
})
