# Code Screenshot Generator

A beautiful and simple tool to create stunning screenshots of your code snippets with syntax highlighting and customizable options.

## ✨ Features

- **Syntax Highlighting**: Support for multiple programming languages (TypeScript, Markdown, PHP, JSON, HTML, Vue)
- **Customizable Size**: Choose from Small, Medium, Large, or Extra Large canvas sizes
- **Dark/Light Mode**: Toggle between dark and light themes
- **Custom Watermark**: Add your own editable watermark to screenshots
- **High Quality**: Export screenshots at 4x scale for crisp, high-resolution images
- **Clean UI**: Minimal and intuitive interface
- **URL Parameters**: Share your configuration via URL (code, language, size, watermark, theme)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v10.21.0)

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

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

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

## 📖 How to Use

1. **Write or Paste Your Code**: Type or paste your code into the editor
2. **Select Language**: Choose the appropriate programming language from the dropdown for syntax highlighting
3. **Adjust Size**: Select your preferred canvas size (Small, Medium, Large, or Extra Large)
4. **Toggle Theme**: Switch between light and dark mode using the theme button
5. **Add Watermark** (Optional): Click on the watermark text at the bottom to customize it
6. **Capture Screenshot**: Click the "Capture" button to download your screenshot as a PNG file

The app automatically saves your preferences in the URL, so you can bookmark or share your configuration.

## 🛠️ Technology Stack

- **Framework**: [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- **Build Tool**: [Vite](https://vitejs.dev/) - Next generation frontend tooling
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [@nuxt/ui](https://ui.nuxt.com/) - UI component library
- **Syntax Highlighting**: [Shiki](https://shiki.style/) - Beautiful and powerful syntax highlighter
- **Screenshot**: [modern-screenshot](https://github.com/qq15725/modern-screenshot) - HTML to image conversion
- **Icons**: [Iconify](https://iconify.design/) - Icon framework

## 🧹 Code Quality

Lint your code:
```bash
pnpm lint
```

Auto-fix linting issues:
```bash
pnpm lint:fix
```

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

**Estéban Soubiran**

- Website: [code.soubiran.dev](https://code.soubiran.dev)
- GitHub: [@Barbapapazes](https://github.com/Barbapapazes)
