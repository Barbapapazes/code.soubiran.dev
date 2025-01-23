import type { RenderOptions } from '@testing-library/vue'
import Button from '@/ui/components/Button.vue'
import ButtonGroup from '@/ui/components/ButtonGroup.vue'
import Input from '@/ui/components/Input.vue'
import theme from '@/ui/theme/button-group'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

describe('button-group', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each<[string, RenderOptions<typeof ButtonGroup>]>([
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'absolute' } }],
    // Slots
    ['with default slot', {
      slots: {
        default: {
          components: { Input, Button },
          template: `<Input /> <Button> Click me! </Button>`,
        },
      },
    }],
    ['orientation vertical with default slot', {
      props: { orientation: 'vertical' },
      slots: {
        default: {
          components: { Input, Button },
          template: `<Input /> <Button> Click me! </Button>`,
        },
      },
    }],
    ...sizes.map((size: string) =>
      [`with size ${size}`, { props: { size }, slots: {
        default: {
          components: { Input, Button },
          template: `<Input /> <Button> Click me! </Button>`,
        },
      } }],
    ),
  ])('renders %s correctly', (name, options) => {
    render(ButtonGroup, {
      attrs: {
        'data-testid': 'button-group',
      },
      ...options,
    })

    expect(screen.getByTestId('button-group')).matchSnapshot()
  })
})
