---
name: vue-tailwind-variants-component
description: 'Create Vue single-file components that use tailwind-variants (`tv`), including Nuxt UI-style modal/slideover/full components, `ui` slot overrides, and the correct `tv` import behavior. Use when generating Vue components, deciding whether to import `tv` from `tailwind-variants`, or following the Barbapapazes snippet structure.'
argument-hint: 'Describe the component to create, which wrapper to use (plain, modal, slideover, etc.), and whether the project auto-imports `tv`.'
user-invocable: true
---

# Vue Tailwind Variants Component

Use this skill when creating a Vue SFC that follows the Barbapapazes component snippet style:
- a `tv(...)` recipe for styling
- `Props`, `Emits`, and `Slots` TypeScript interfaces
- a `ui` prop for slot overrides
- a computed `ui` helper
- optional wrapper markup such as `UModal` or `USlideover`

## What this skill should produce

Generate a Vue component that:
1. Matches existing project conventions before introducing new ones.
2. Uses `tailwind-variants` slot recipes in the same style as the snippet reference.
3. Decides correctly whether `tv` must be imported or can be omitted.
4. Exposes `class` and `ui` props in a way that allows consumer overrides.
5. Keeps the output ready to edit rather than over-filling business logic.
6. Places all imports at the top of the first `<script lang="ts">` block when a component uses both a normal script block and a `<script setup>` block.
7. Never creates empty `tv` slot keys such as `base: ''` or `content: ''`.

## Import decision for `tv`

Always make this decision before writing the component:

1. Inspect nearby Vue components or shared UI files for `tv(` usage.
2. If the codebase already imports `tv` explicitly, keep doing that.
3. If the codebase already uses `tv(` without importing it in the file, assume project auto-imports or globally provides it and do not add the import.
4. If there is no evidence either way:
   - prefer `import { tv } from 'tailwind-variants'` in generic Vue or Vite projects
   - omit the import only when the project clearly uses an auto-import setup or documented convention
5. Never add a duplicate `tv` import.

When uncertain, state the assumption briefly in the response, for example: “I imported `tv` explicitly because I found no local auto-import convention.”

See [reference patterns](./references/snippet-patterns.md).

## Procedure

### 1. Read the local conventions first

Before generating the component:
- inspect existing Vue SFCs, especially UI components
- check whether `tv`, `computed`, `defineProps`, `defineEmits`, or `defineSlots` are imported or auto-provided
- reuse the established component shell if one already exists in the project

If the project has a stronger local pattern than this skill, follow the project.

### 2. Build the component skeleton

Start from this structure unless the project uses a different established pattern:
- a top `<script lang="ts">` block for the `tv(...)` recipe and exported interfaces
- a `<script lang="ts" setup>` block for props, emits, slots, and derived `ui`
- a `<template>` block with minimal but valid markup

When both script blocks are present:
- put all imports in the first `<script lang="ts">` block
- do not place imports in the second `<script setup>` block
- keep the second block focused on props, emits, slots, state, and derived values

### 3. Create the `tv(...)` recipe

Use a named recipe derived from the component name and define slot-based styles, for example a `base` slot first. Keep the initial recipe minimal unless the user asked for concrete variants.

Typical shape:
- `const componentName = tv({ slots: { base: '...' } })`
- add slot keys only when they have real classes to apply
- never add placeholder slot entries with empty strings just to reserve future override points
- add variants or compound variants only when requested or when the surrounding codebase expects them

### 4. Export the TypeScript contracts

Use the snippet-style interface layout:
- `Props` includes `class?: any`
- `Props` includes `ui?: Partial<typeof componentName.slots>`
- `Emits` and `Slots` interfaces exist even if initially empty

If the project uses stricter types for `class`, reuse that local convention instead of forcing `any`.

### 5. Wire up the setup block

In `<script setup>`:
- define props with the generated `Props` interface
- define emits and slots interfaces when the component needs them
- create `const ui = computed(() => componentName())`

If the project requires explicit imports for Vue macros or `computed`, add them. If the project auto-imports them, do not add noisy imports.

### 6. Render with override-friendly classes

When rendering the main element or wrapper component, merge generated classes with consumer overrides in the snippet style.

Preferred pattern for wrapper/base class application:
- `ui.base({ class: [props.ui?.base, props.class] })`

If multiple styled slots exist, pass overrides slot-by-slot using the same idea.
If an element has no local classes, do not create a `tv` slot key for it and do not wire a matching `props.ui` access for that element.

### 7. Apply wrapper-specific patterns when requested

For components that wrap an existing UI primitive:
- **Plain component**: minimal template and expose slots/markup only as needed.
- **Slideover**: use `USlideover`, optional `title` and `description`, and place user content in the body slot.
- **Modal**: use `UModal`, optional `title` and `description`, and place user content in the body slot.

Keep placeholder text intentionally lightweight so the user can adapt it.

## Quality checks

Before finishing, verify that:
- the `tv` import decision matches visible project evidence
- all imports live at the top of the first `<script lang="ts">` block when dual script blocks are used
- the component name matches the file or requested name
- `Props`, `Emits`, and `Slots` names are consistent
- `ui` typing points to `typeof recipe.slots`
- the template merges `props.ui` and `props.class` correctly
- the `tv` recipe contains no empty string slot placeholders
- no unnecessary imports were introduced
- the output is valid Vue + TypeScript for the current project style

## Response behavior

When using this skill, the response should:
- briefly mention whether `tv` was imported or omitted and why
- mention any assumption about auto-imports
- call out any local convention it followed
- keep generated code practical and editable, not overly abstract

## Good prompts for this skill

- Create a Vue component with tailwind-variants for a button-like wrapper.
- Create a `UModal`-based Vue component with a `tv` recipe and `ui` overrides.
- Scaffold a Vue SFC like the Barbapapazes snippets and decide whether `tv` needs importing.
- Generate a slideover component with `tailwind-variants`, following existing project conventions.
