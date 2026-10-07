/** Never send the editor's shared code, title, or watermark URL parameters. */
export function sanitizeAnalyticsPayload(_type: string, payload: Record<string, unknown>) {
  function stripParameters(value: unknown) {
    return typeof value === 'string' ? value.split(/[?#]/, 1)[0] : ''
  }

  return {
    ...payload,
    url: stripParameters(payload.url),
    referrer: stripParameters(payload.referrer),
    title: 'Code ・ Estéban Soubiran',
  }
}
