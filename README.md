# Code Screenshot Generator

A beautiful and simple tool to create stunning screenshots of your code snippets with syntax highlighting and customizable options.

## Features

- **Syntax Highlighting**: Support for multiple programming languages (TypeScript, Markdown, PHP, JSON, HTML, Vue)
- **Customizable Size**: Choose from Small, Medium, Large, or Extra Large canvas sizes
- **Dark/Light Mode**: Toggle between dark and light themes
- **Custom Watermark**: Add your own editable watermark to screenshots
- **High Quality**: Export screenshots to images
- **URL Parameters**: Share your configuration via URL (`code`, `language`, `size`, `gradient`, `watermark`, and `title`)
- **MCP Tool**: Let agents generate a code image with the focused `generate_code_image` tool

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Barbapapazes/code.soubiran.dev.git
cd code.soubiran.dev
```

2. Install dependencies:
```bash
pnpm install
```

### Development

Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`.

### MCP and Kitesurf

The deployed MCP server is available at `https://code.soubiran.dev/mcp`. Its `generate_code_image` tool accepts the same configurable values as the editor (`code`, `language`, `size`, `gradient`, `title`, and `watermark`) and returns a PNG image of the complete code card.

The Worker is stateless and calls Cloudflare Browser Run's Kitesurf engine. Configure these values before running the Worker locally or deploying it:

- `BROWSER_RUN_ACCOUNT_ID`: the Cloudflare account ID that owns Browser Run.
- `BROWSER_RUN_API_TOKEN`: a Cloudflare API token with only the `Browser Rendering - Edit` permission.

Copy the placeholder values in `.dev.vars` for local Worker development and configure the production values as Wrangler secrets. Never expose the API token to MCP clients or frontend code.

The MCP endpoint is intentionally public. Configure a Cloudflare WAF or rate-limiting rule for `POST /mcp` before production deployment, because every tool invocation consumes Browser Run quota.

### Build

Build the application for production:

```bash
pnpm build
```

The built files will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
pnpm preview
```
