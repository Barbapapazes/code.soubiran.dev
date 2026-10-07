# code.soubiran.dev

Create and share beautiful, syntax-highlighted images of your code.

[Open the editor](https://code.soubiran.dev), paste your code, customize the card, and select **Capture** to download a PNG. Share the URL to share the card.

## MCP

Connect your agent to `https://code.soubiran.dev/mcp`. The public `generate_code_image` tool accepts `code` and optional `language`, `size`, `gradient`, `title`, and `watermark` values.

## Architecture

The client is split into local Nuxt feature modules under `app/modules/`. Each module registers its public API in `index.ts`; implementation details and colocated tests live in `runtime/`.

- **editor**: URL-backed settings, code-image UI, highlighting, PNG capture, and editor tool definitions. Exposes `EditorWorkspace` and `useEditor`.
- **assistant**: on-device AI initialization, chat, Markdown rendering, and AI SDK tool adaptation. Exposes `AssistantToggle` and `AssistantPanel`; receives editor tools rather than owning them.
- **webmcp**: browser tool registration and the experimental discovery client. Exposes `useWebMCP` and `createWebMCPClient`, independently of the assistant.
- **analytics**: Umami configuration, typed events, page tracking, and URL payload sanitization. Exposes `useAnalytics`. Code, prompts, titles, and watermark content must never be tracked.

`app/app.vue` composes these features. Global styles and metadata remain application-level. The public MCP endpoint and rendering infrastructure stay in `worker/`, with frontend/Worker contracts in `shared/`.

## Sponsors

<p align="center">
  <a href="https://github.com/sponsors/barbapapazes">
    <img src="https://cdn.jsdelivr.net/gh/barbapapazes/static/sponsors.svg" alt="Sponsors" />
  </a>
</p>

## License

[MIT](./LICENSE) License © 2026-PRESENT [Estéban Soubiran](https://github.com/Barbapapazes)
