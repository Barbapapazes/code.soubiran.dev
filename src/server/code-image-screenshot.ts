import type { CodeImage, CodeImageEnvironment, CodeImageInput } from '@/server/types'
import { createCodeImageUrl } from '@/server/code-image-url'
import { BrowserRunError } from '@/server/errors'
import { base64EncodeBytes } from '@/shared/base64'
import { codeImageSelector } from '@/shared/code-image'

const browserRunUrl = 'https://api.cloudflare.com/client/v4/accounts'

export async function generateCodeImage(
  env: CodeImageEnvironment,
  input: CodeImageInput,
): Promise<CodeImage> {
  const endpoint = new URL(`${browserRunUrl}/${env.BROWSER_RUN_ACCOUNT_ID}/browser-run/screenshot`)
  endpoint.searchParams.set('browser', 'kitesurf')

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.BROWSER_RUN_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: createCodeImageUrl(input).toString(),
      selector: codeImageSelector,
      waitForSelector: {
        selector: codeImageSelector,
        visible: true,
        timeout: 15_000,
      },
      gotoOptions: {
        waitUntil: 'networkidle0',
        timeout: 45_000,
      },
      screenshotOptions: {
        type: 'png',
      },
    }),
  })

  if (!response.ok) {
    throw new BrowserRunError(response.status, await response.text())
  }

  return {
    data: base64EncodeBytes(new Uint8Array(await response.arrayBuffer())),
    mimeType: response.headers.get('content-type') ?? 'image/png',
  }
}
