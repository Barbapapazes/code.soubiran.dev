# Barbapapazes Vue snippet patterns

## Shared structure

The component snippets consistently use:
- a top `<script lang="ts">` block
- a `tv({ slots: { base: '...' } })` recipe when a base element actually has classes
- exported interfaces for `Props`, `Emits`, and `Slots`
- `class?: any` in props
- `ui?: Partial<typeof recipe.slots>` in props
- a `<script lang="ts" setup>` block
- `const props = defineProps<...>()`
- `defineEmits<...>()`
- `defineSlots<...>()`
- `const ui = computed(() => recipe())`

When a component uses both `<script lang="ts">` and `<script lang="ts" setup>`:
- all imports should be placed at the top of the first `<script lang="ts">` block
- the second block should not introduce imports
- the first block owns recipe declarations, imports, and exported interfaces

## Base component pattern

The full component snippet starts very light:
- define the `tv` recipe
- export the interfaces
- create `props`, emits, slots, and computed `ui`
- leave the template mostly open for the caller to fill in

Only add slot keys for elements that already have real classes. Do not use empty string placeholders such as `base: ''` or `content: ''` just to reserve a future override API.

## Wrapper component pattern

The modal and slideover variants add:
- `title` and `description` placeholders
- wrapper usage such as `UModal` or `USlideover`
- class application using `ui.base({ class: [props.ui?.base, props.class] })` to allow consumer overrides using the `ui` prop and `class` prop. `class` is intentionally merged last to allow it to override any styles.
- user content inside the wrapper body slot

If a nested element does not receive local classes, do not create a matching `tv` slot for it.

## `tv` import rule of thumb

The source snippet shows `tv(...)` usage but does not itself demonstrate the import decision. For generated components, use this order of precedence:

1. Match the local repository convention if examples already exist.
2. If local files import `tv` from `tailwind-variants`, do the same.
3. If local files use `tv` without an import, assume an auto-import or global setup.
4. If no evidence exists, prefer an explicit `import { tv } from 'tailwind-variants'` unless the project clearly documents auto-imports.

## Vue import rule of thumb

Apply the same convention-sensitive logic to `computed` and any other helpers:
- import explicitly in standard Vue/Vite codebases
- omit imports when the project uses auto-imported Vue APIs

## Biases to avoid

Do not:
- assume Nuxt auto-imports unless the project suggests it
- put imports in the `<script setup>` block when a normal `<script lang="ts">` block already exists
- add variants, compound variants, or slots the user did not ask for
- add empty `tv` slot placeholders with `''` values
- replace local typing conventions just because the snippet uses `any`
- invent extra business logic in a scaffold component
