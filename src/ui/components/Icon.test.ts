import type { RenderOptions } from '@testing-library/vue'
import Icon from '@/ui/components/Icon.vue'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

describe('icon', () => {
  const props = { name: 'i-lucide-alarm-clock' }

  it.each<[string, RenderOptions<typeof Icon>]>([
    // Props
    ['with icon', { props }],
    ['with as', { props: { ...props, as: 'div' } }],
    ['with class', { props: { ...props, class: 'custom-class' } }],
  ])('renders %s correctly', (name, options) => {
    render(Icon, {
      attrs: {
        'data-testid': 'icon',
      },
      ...options,
    })

    expect(screen.getByTestId('icon')).matchSnapshot()
  })
})
