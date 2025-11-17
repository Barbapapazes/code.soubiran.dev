# GitHub Copilot Instructions

This repository contains a Vue 3 code screenshot/editor application built with TypeScript and Vite.

## Tech Stack

- **Framework**: Vue 3 with `<script setup>` SFC syntax
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: pnpm (version 10.21.0)
- **Styling**: Tailwind CSS with @nuxt/ui components
- **Code Highlighting**: Shiki
- **Linting**: ESLint with @antfu/eslint-config

## Project Structure

- `src/` - Source code directory
  - `components/` - Vue components (Editor, Textarea, Render, Watermark, etc.)
  - `composables/` - Vue composables (useShiki, useScreenshot, useCode, etc.)
  - `utils/` - Utility functions
  - `types/` - TypeScript type definitions
  - `state/` - Application state management
  - `styles/` - Global styles
  - `App.vue` - Main application component
  - `main.ts` - Application entry point

## Development Commands

- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix

## Code Style & Conventions

### General
- Use TypeScript for all new files
- Follow the ESLint configuration (@antfu/eslint-config)
- Use 2 spaces for indentation
- Always run `pnpm lint` before committing

### Vue Components
- Use `<script setup>` syntax for all Vue components
- Use `lang="ts"` for TypeScript support
- Import types with `import type { ... }`
- Use composition API and composables for reusable logic

### File Organization
- Place reusable logic in `composables/`
- Place utility functions in `utils/`
- Place type definitions in `types/`
- Use auto-imports for Vue APIs and composables (configured in vite.config.ts)

### Styling
- Use Tailwind CSS utility classes
- Use @nuxt/ui components for UI elements
- Prefer composition over inheritance
- Use dark mode support with `useDark` from @vueuse/core

### Naming Conventions
- Components: PascalCase (e.g., `EditorWrapper.vue`)
- Composables: camelCase with `use` prefix (e.g., `useScreenshot.ts`)
- Types: PascalCase (e.g., `Language`, `SelectItem`)
- Files: kebab-case for utilities, PascalCase for components

## Path Aliases

- `@/` - Maps to `src/` directory

## Auto-imports

The project uses unplugin-auto-import with the following auto-imported modules:
- Vue APIs (ref, computed, watch, etc.)
- @vueuse/core utilities
- Custom composables from `src/composables/`
- Custom utils from `src/utils/`
- `tv` from tailwind-variants

## Icons

Icons are auto-installed using unplugin-icons with the format:
```typescript
import iconName from '~icons/ph/icon-name'
```

## CI/CD

The project uses GitHub Actions for CI:
- Lint check on push and PR to main branch
- Build check on push and PR to main branch

## Best Practices

1. Keep components small and focused
2. Extract reusable logic into composables
3. Use TypeScript for type safety
4. Follow the existing code style and patterns
5. Test your changes with `pnpm dev` before committing
6. Ensure `pnpm lint` and `pnpm build` pass before pushing
7. Use meaningful commit messages
