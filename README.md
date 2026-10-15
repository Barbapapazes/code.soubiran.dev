# code.soubiran.dev

Create and share beautiful, syntax-highlighted images of your code.

[Open the editor](https://code.soubiran.dev), paste your code, customize the card, and select **Capture** to download a PNG. Share the URL to share the card.

## Development

Install [Vite+](https://viteplus.dev/guide/) and use Node.js matching the
`engines.node` range in `package.json`.

```sh
vp install
vp run prepare
vp run dev
```

Vite+ provides Vite, formatting, linting, and unit tests. Nuxt still owns the app
and Cloudflare Worker build configuration in `nuxt.config.ts`; `vite.config.ts`
configures the standalone Vite+ tooling and tests.

```sh
vp check          # Check formatting and lint
vp run lint:fix   # Format and apply lint fixes
vp run typecheck # Check Nuxt/Vue and Worker types
vp test
vp run build     # Build through Nuxt, not standalone Vite
vp run deploy
```

## MCP

Connect your agent to `https://code.soubiran.dev/mcp`. The public `generate_code_image` tool accepts `code` and optional `language`, `size`, `gradient`, `title`, and `watermark` values.

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/barbapapazes">
    <img src="https://cdn.jsdelivr.net/gh/barbapapazes/static/sponsors.svg" alt="Sponsors" />
  </a>
</p>

## License

[MIT](./LICENSE) License © 2026-PRESENT [Estéban Soubiran](https://github.com/Barbapapazes)
