import { sanitizeAnalyticsPayload } from '../utils/analytics'

declare global {
  interface Window {
    __codeAnalyticsBeforeSend: typeof sanitizeAnalyticsPayload
  }
}

export default defineNuxtPlugin(() => {
  // Umami calls this for both page views and events, including their referrers.
  window.__codeAnalyticsBeforeSend = sanitizeAnalyticsPayload

  const { trackPage } = useAnalytics()
  // This app has no routes: query changes customize the card, not the page.
  onNuxtReady(() => trackPage())
})
