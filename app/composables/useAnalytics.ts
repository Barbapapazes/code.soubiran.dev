import type { CodeImageGradient, CodeImageLanguage, CodeImageSize } from '#shared/code-image'

interface AnalyticsEventMap {
  editor_color_mode_change: { mode: 'dark' | 'light' }
  editor_size_change: { size: CodeImageSize }
  editor_language_change: { language: CodeImageLanguage }
  editor_gradient_change: { gradient: CodeImageGradient }
  editor_title_enable: Record<string, never>
  editor_title_submit: { enabled: boolean }
  capture_start: Record<string, never>
  capture_success: Record<string, never>
  capture_failure: Record<string, never>
  assistant_initialize_start: Record<string, never>
  assistant_initialize_success: Record<string, never>
  assistant_initialize_failure: Record<string, never>
  assistant_open: Record<string, never>
  assistant_close: Record<string, never>
  assistant_clear: Record<string, never>
  assistant_message_send: Record<string, never>
  assistant_message_success: Record<string, never>
  assistant_message_failure: Record<string, never>
  assistant_message_stop: Record<string, never>
}

export function useAnalytics() {
  const { proxy: umami } = useScriptUmamiAnalytics()

  function track<EventName extends keyof AnalyticsEventMap>(
    event: EventName,
    properties: AnalyticsEventMap[EventName],
  ) {
    // Only predefined settings and actions: never code, prompts, tool data, or errors.
    if (import.meta.dev) {
      // eslint-disable-next-line no-console -- Safe development-only analytics diagnostics.
      console.debug('[analytics] event', event, properties)
    }

    umami.track(event, properties)
  }

  function trackPage() {
    if (import.meta.dev) {
      // eslint-disable-next-line no-console -- Safe development-only analytics diagnostics.
      console.debug('[analytics] pageview')
    }

    umami.track()
  }

  return { track, trackPage }
}
