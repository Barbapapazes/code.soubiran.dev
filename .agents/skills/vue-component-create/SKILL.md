---
name: vue-component-create
description: Create a Vue component with the proper structure and files. Use when creating a Vue component, adding a component file, scaffolding a Vue SFC, or when a new component is needed.
user-invocable: false
metadata:
  author: Estéban Soubiran <skills@soubiran.dev>
---

When creating a new Vue component, always follow this structure.

## Naming rules

Derive names from the component filename without the `.vue` extension:

- Use `camelCase` for the local `tv()` constant.
- Use `PascalCase` for exported `Props`, `Emits`, and `Slots` interfaces.
- Keep the interface names prefixed with the component name.

Examples:

| Filename | `tv()` constant | Props interface | Emits interface | Slots interface |
| --- | --- | --- | --- | --- |
| `UserCard.vue` | `userCard` | `UserCardProps` | `UserCardEmits` | `UserCardSlots` |
| `ProjectsSection.vue` | `projectsSection` | `ProjectsSectionProps` | `ProjectsSectionEmits` | `ProjectsSectionSlots` |

## Required structure

Use two script blocks:

1. A regular `<script lang="ts">` block for the `tv()` style object and exported interfaces.
2. A `<script lang="ts" setup>` block for `defineProps`, `defineEmits`, `defineSlots`, and computed `ui`.

Every component must include:

- A `class?: any` prop.
- A `ui?: Partial<typeof componentName.slots>` prop.
- Empty `Emits` and `Slots` interfaces, unless the component needs typed events or slots.
- `const ui = computed(() => componentName())`.
- A root style slot, usually `root` for multi-slot components or `base` for very simple components, applied to the outer element with `props.class` and the matching `props.ui` override.

## `tv()` slot usage

The `tv()` object defines semantic style slots for the component. Slot keys must describe the component region where the generated class is applied, not the CSS properties inside the class.

Use meaningful names such as:

- `root` for the outermost rendered component or wrapper.
- `header` for the header area.
- `title` for a heading or title element.
- `description` for descriptive text.
- `content` for the main body.
- `metadata` for metadata or badges.
- `actions` for buttons, links, or controls.
- `footer` for the footer area.

Apply each slot to the matching semantic element in the template, and pass the matching `props.ui` override to the same slot:

```vue
<Card :class="ui.root({ class: [props.ui?.root, props.class] })">
  <div :class="ui.header({ class: props.ui?.header })">
    <h3 :class="ui.title({ class: props.ui?.title })">
      {{ props.title }}
    </h3>
  </div>
</Card>
```

## Canonical example

For a file named `UserCard.vue`, create:

```vue
<script lang="ts">
const userCard = tv({
  slots: {
    root: '',
    header: '',
    title: '',
    description: '',
  },
})

export interface UserCardProps {
  title: string
  description?: string
  class?: any
  ui?: Partial<typeof userCard.slots>
}
export interface UserCardEmits {}
export interface UserCardSlots {}
</script>

<script lang="ts" setup>
const props = defineProps<UserCardProps>()
defineEmits<UserCardEmits>()
defineSlots<UserCardSlots>()

const ui = computed(() => userCard())
</script>

<template>
  <article :class="ui.root({ class: [props.ui?.root, props.class] })">
    <header :class="ui.header({ class: props.ui?.header })">
      <h3 :class="ui.title({ class: props.ui?.title })">
        {{ props.title }}
      </h3>
    </header>

    <p v-if="props.description" :class="ui.description({ class: props.ui?.description })">
      {{ props.description }}
    </p>
  </article>
</template>
```

Adapt the example names to the actual filename and the template content to the component's purpose. The root element and slot names should match the component's semantic structure.
