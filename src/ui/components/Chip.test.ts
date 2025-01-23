import type { RenderOptions } from '@testing-library/vue'
import Chip from '@/ui/components/Chip.vue'
import theme from '@/ui/theme/chip'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

describe('chip', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const positions = Object.keys(theme.variants.position) as any

  it.each<[string, RenderOptions<typeof Chip>]>([
    // Props
    ['with text', { props: { text: 'Text' } }],
    ['with inset', { props: { inset: true } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...positions.map((position: string) => [`with position ${position}`, { props: { position } }]),
    ['with color neutral', { props: { color: 'neutral' } }],
    ['without show', { props: { show: false } }],
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'mx-auto' } }],
    ['with ui', { props: { ui: { base: 'text-[var(--ui-text-muted)]' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with content slot', { slots: { content: () => 'Content slot' } }],
  ])('renders %s correctly', (_, options) => {
    render(Chip, {
      attrs: {
        'data-testid': 'chip',
      },
      ...options,
    })

    expect(screen.getByTestId('chip')).toMatchSnapshot()
  })
})
