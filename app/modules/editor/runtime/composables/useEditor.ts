import type { MaybeRefOrGetter } from 'vue'
import { createCaptureCodeTool } from '../tools/captureCode'
import { createSetCodeTool } from '../tools/setCode'
import { createSetCodeOptionsTool } from '../tools/setCodeOptions'
import { useCode } from './useCode'
import { useCodeTitle } from './useCodeTitle'
import { useGradient } from './useGradient'
import { useLanguage } from './useLanguage'
import { useScreenshot } from './useScreenshot'
import { useSize } from './useSize'
import { useWatermark } from './useWatermark'

/** Editor state and capabilities shared by the workspace, assistant, and WebMCP. */
export function useEditor(element: MaybeRefOrGetter<HTMLElement | null | undefined>) {
  const { code } = useCode()
  const { title } = useCodeTitle()
  const { watermark } = useWatermark()
  const { size } = useSize()
  const { language, languages } = useLanguage()
  const { gradient } = useGradient()
  const { capture } = useScreenshot(element)

  const tools = [
    createSetCodeTool(code),
    createSetCodeOptionsTool({ language, size, gradient, title, watermark }),
    createCaptureCodeTool(capture),
  ] satisfies WebMCP.ModelContextTool[]

  return { code, title, watermark, size, language, languages, gradient, capture, tools }
}
