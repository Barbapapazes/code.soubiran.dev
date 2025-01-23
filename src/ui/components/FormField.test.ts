import type { RenderOptions } from '@testing-library/vue'
import FormField from '@/ui/components/FormField.vue'
import Input from '@/ui/components/Input.vue'
import theme from '@/ui/theme/form-field.js'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

describe('form-field', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each<[string, RenderOptions<typeof FormField>]>([
  // Props
    ['with label and description', { props: { label: 'Username', description: 'Enter your username' } }],
    ['with required', { props: { label: 'Username', required: true } }],
    ['with help', { props: { help: 'Username must be unique' } }],
    ['with error', { props: { error: 'Username is already taken' } }],
    ['with hint', { props: { hint: 'Use letters, numbers, and special characters' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Username', description: 'Enter your username', size } }]),
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'relative' } }],
    ['with ui', { props: { ui: { label: 'text-[var(--ui-text-highlighted)]' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with label slot', { slots: { label: () => 'Label slot' } }],
    ['with description slot', { slots: { description: () => 'Description slot' } }],
    ['with error slot', { slots: { error: () => 'Error slot' } }],
    ['with hint slot', { slots: { hint: () => 'Hint slot' } }],
    ['with help slot', { slots: { help: () => 'Help slot' } }],
  ])('renders %s correctly', (_, options) => {
    render(FormField, {
      attrs: {
        'data-testid': 'form-field',
      },
      ...options,
    })

    expect(screen.getByTestId('form-field')).toMatchSnapshot()
  })

  it('provides the id to the input', () => {
    render(FormField, {
      attrs: { 'data-testid': 'form-field' },
      props: { label: 'Form Field' },
      slots: { default: () => h(Input, { label: 'Name' }) },
    })

    expect(screen.getByTestId('form-field')).toMatchSnapshot()
  })
})
