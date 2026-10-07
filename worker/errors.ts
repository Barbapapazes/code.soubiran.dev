export class BrowserRunError extends Error {
  constructor(
    readonly status: number,
    responseBody: string,
  ) {
    super(`Browser Run could not generate the code image (${status}): ${responseBody}`)
    this.name = 'BrowserRunError'
  }
}
