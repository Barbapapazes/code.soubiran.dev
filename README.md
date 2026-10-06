# code.soubiran.dev

Create and share beautiful, syntax-highlighted images of your code.

[Open the editor](https://code.soubiran.dev) or use the [MCP server](https://code.soubiran.dev/mcp) to generate code images with an agent.

## Use it Manually

1. Paste or write your code in the editor.
2. Choose a language, canvas size, gradient, and light or dark appearance.
3. Optionally add a title and watermark.
4. Select **Capture** to download the image.

Its state is stored in the URL, so you can share a configured code card with others.

## Use it with an Agent

Connect an MCP-compatible client to `https://code.soubiran.dev/mcp` to use the public `generate_code_image` tool. It generates a PNG code card from `code` and accepts optional `language`, `size`, `gradient`, `title`, and `watermark` values.

## Development

The editor is a client-rendered Nuxt 4 app using the experimental
`@nuxt/vite-server` builder. The Cloudflare Vite plugin builds the SPA and MCP
Worker together; Nitro is not used for the build.

Use Node.js `^22.22.3 || ^24.15.0 || >=26.0.0` and the pnpm version in
`package.json`:

```sh
pnpm install --frozen-lockfile
pnpm prepare
pnpm dev
```

- `app/` contains the browser editor, local assistant, and WebMCP tools.
- `shared/` defines the URL encoding and code-card options used by both sides.
- `worker/` contains the public MCP endpoint and Browser Run integration. It is
  a Cloudflare Worker, **not** Nuxt's `server/` directory.

The UI remains client-rendered because its editor state and AI model belong to
the browser. Cloudflare serves the generated SPA assets and sends `/mcp` requests
to the Worker first. The Worker also delegates non-MCP requests to its `ASSETS`
binding.

For local MCP image generation, copy `.env.example` to `.dev.vars` and supply
Cloudflare Browser Run credentials. Never put these secrets in Nuxt public runtime
config. Image generation uses the canonical deployed editor URL, even when the
MCP endpoint runs locally.

## Validation and deployment

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
node scripts/verify-build.mjs
pnpm preview
```

Build on CI or a machine with sufficient memory. The build writes the SPA to
`.output/public` and the Worker plus deployment configuration to
`.output/code_soubiran_dev`. `pnpm preview` runs the built deployment in workerd;
`nuxt preview` would only preview the static SPA, not the MCP endpoint. Successful
CI runs publish a `cloudflare-build` artifact; extract its contents into `.output/`
to preview or deploy without rebuilding.

CI checks the actual Worker with Wrangler and Chromium: it serves the SPA and its
JavaScript assets, loads a shared code card, updates URL state, downloads a PNG,
initializes MCP, discovers `generate_code_image`, and rejects untrusted origins. Unit tests mock image generation; the smoke test does not call the paid
Browser Run API or require production secrets. Browser-local AI and WebMCP still
need a supporting browser for manual end-to-end validation.

Set production secrets with `wrangler secret put BROWSER_RUN_ACCOUNT_ID` and
`wrangler secret put BROWSER_RUN_API_TOKEN`. Run `pnpm deploy` on a capable
machine, or deploy a prebuilt artifact with:

```sh
pnpm exec wrangler deploy --config .output/code_soubiran_dev/wrangler.json
```

Nuxt and its Vite server builder are pinned to 4.6.0 because the builder is highly
experimental. Upgrade them together and rerun the deployment smoke test.

## Sponsors

<p align="center">
	<a href="https://github.com/sponsors/barbapapazes">
		<img src="https://cdn.jsdelivr.net/gh/barbapapazes/static/sponsors.svg" alt="Sponsors">
	</a>
</p>

## License

[MIT](LICENSE) License © 2026-PRESENT [Estéban Soubiran](https://github.com/Barbapapazes)
