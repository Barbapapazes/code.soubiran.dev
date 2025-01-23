import type { RenderOptions } from '@testing-library/vue'
import Button from '@/ui/components/Button.vue'
import theme from '@/ui/theme/button'
import { fireEvent, render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

describe('button', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each<[string, RenderOptions<typeof Button>]>([
    // Props
    ['with label', { props: { label: 'Button' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Button', size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { label: 'Button', variant } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { label: 'Button', variant, color: 'neutral' } }]),
    ['with icon', { props: { icon: 'i-lucide-rocket' } }],
    ['with leading and icon', { props: { leading: true, icon: 'i-lucide-arrow-left' } }],
    ['with leadingIcon', { props: { leadingIcon: 'i-lucide-arrow-left' } }],
    ['with trailing and icon', { props: { trailing: true, icon: 'i-lucide-arrow-right' } }],
    ['with trailingIcon', { props: { trailingIcon: 'i-lucide-arrow-right' } }],
    ['with avatar', { props: { avatar: { src: 'https://github.com/vuejs.png' } } }],
    ['with avatar and leadingIcon', { props: { avatar: { src: 'https://github.com/vuejs.png' }, leadingIcon: 'i-lucide-arrow-left' } }],
    ['with avatar and trailingIcon', { props: { avatar: { src: 'https://github.com/vuejs.png' }, trailingIcon: 'i-lucide-arrow-right' } }],
    ['with loading', { props: { loading: true } }],
    ['with loading and avatar', { props: { loading: true, avatar: { src: 'https://github.com/vuejs.png' } } }],
    ['with loading trailing', { props: { loading: true, trailing: true } }],
    ['with loading trailing and avatar', { props: { loading: true, trailing: true, avatar: { src: 'https://github.com/vuejs.png' } } }],
    ['with loadingIcon', { props: { loading: true, loadingIcon: 'i-lucide-sparkles' } }],
    ['with disabled', { props: { label: 'Button', disabled: true } }],
    ['with disabled and with link', { props: { label: 'Button', disabled: true, to: '/link' } }],
    ['with block', { props: { label: 'Button', block: true } }],
    ['with square', { props: { label: 'Button', square: true } }],
    ['with as', { props: { label: 'Button', as: 'div' } }],
    ['with class', { props: { label: 'Button', class: 'rounded-full font-bold' } }],
    ['with ui', { props: { label: 'Button', ui: { label: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }],
  ])('renders %s correctly', (_, options) => {
    render(Button, {
      attrs: {
        'data-testid': 'button',
      },
      ...options,
    })

    expect(screen.getByTestId('button')).matchSnapshot()
  })

  it('emits a click event when clicked', async () => {
    const { emitted } = render(Button, {
      attrs: {
        'data-testid': 'button',
      },
      props: {
        label: 'Button',
      },
    })

    await fireEvent.click(screen.getByTestId('button'))

    expect(emitted()).toMatchSnapshot()
  })
})
