import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { readFile, stat } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const configPath = resolve('.output/code_soubiran_dev/wrangler.json')
const config = JSON.parse(await readFile(configPath, 'utf8'))
const assetsDirectory = resolve(dirname(configPath), config.assets.directory)
await stat(resolve(dirname(configPath), config.main))
const html = await readFile(resolve(assetsDirectory, 'index.html'), 'utf8')
assert.match(html, /Code ・ Estéban Soubiran/)
assert.equal(config.assets.binding, 'ASSETS')
assert.equal(config.assets.not_found_handling, 'single-page-application')
assert.deepEqual(config.assets.run_worker_first, ['/mcp'])

// Exercise the actual build in workerd, not a Node import of its Worker bundle.
const server = spawn('pnpm', ['exec', 'wrangler', 'dev', '--config', configPath, '--ip', '127.0.0.1', '--port', '8787', '--local'], {
  stdio: 'inherit',
  env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
})
const origin = 'http://127.0.0.1:8787'
let sessionId

async function rpc(message) {
  const response = await fetch(origin + '/mcp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/event-stream',
      ...(sessionId ? { 'Mcp-Session-Id': sessionId } : {}),
    },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(15000),
  })
  assert.equal(response.status, 200)
  sessionId = response.headers.get('mcp-session-id') ?? sessionId
  const body = await response.text()
  if (response.headers.get('content-type')?.includes('text/event-stream')) {
    return JSON.parse(body.split('\n').find(line => line.startsWith('data: ')).slice(6))
  }
  return JSON.parse(body)
}

try {
  let ready = false
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) {
      throw new Error('Wrangler exited before becoming ready')
    }
    try {
      ready = (await fetch(origin, { signal: AbortSignal.timeout(1000) })).ok
    }
    catch {}
    if (ready)
      break
    await delay(1000)
  }
  assert.ok(ready, 'Built Worker did not start within 60 seconds')

  const page = await fetch(origin + '/?code=aGVsbG8%3D')
  assert.equal(page.status, 200)
  const document = await page.text()
  assert.match(document, /Generate downloadable code snippets/)
  const asset = document.match(/(?:src|href)="(\/_nuxt\/[^"?]+\.js)/)?.[1]
  assert.ok(asset, 'SPA document should reference a built JavaScript asset')
  assert.equal((await fetch(origin + asset)).status, 200)

  const initialized = await rpc({
    jsonrpc: '2.0', id: 1, method: 'initialize',
    params: { protocolVersion: '2025-11-25', capabilities: {}, clientInfo: { name: 'ci-smoke-test', version: '1.0.0' } },
  })
  assert.equal(initialized.result.serverInfo.name, 'code.soubiran.dev')
  const listed = await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} })
  assert.deepEqual(listed.result.tools.map(tool => tool.name), ['generate_code_image'])
  assert.ok(listed.result.tools[0].inputSchema.properties.code)

  const forbidden = await fetch(origin + '/mcp', {
    method: 'POST',
    headers: { 'Origin': 'https://untrusted.example', 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'tools/list' }),
  })
  assert.equal(forbidden.status, 403)
  console.log('Verified Nuxt SPA assets, MCP initialization/tool discovery, and origin restrictions in the built Worker.')
}
finally {
  server.kill('SIGTERM')
}
