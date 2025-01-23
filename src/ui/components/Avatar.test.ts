import type { RenderOptions } from '@testing-library/vue'
import Avatar from '@/ui/components/Avatar.vue'
import theme from '@/ui/theme/avatar'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

describe('avatar', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each<[string, RenderOptions<typeof Avatar>]>([
    // Props
    ['with src', { props: { src: 'https://github.com/vuejs.png' } }],
    ['with alt', { props: { alt: 'Vue.js' } }],
    ['with text', { props: { text: '+1' } }],
    ['with icon', { props: { icon: 'i-lucide-image' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { src: 'https://github.com/vuejs.png', size } }]),
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'bg-[var(--ui-bg)]' } }],
    ['with ui', { props: { ui: { fallback: 'font-bold' } } }],
    // Slots
    ['with default slot', { slots: { default: '🇫🇷' } }],
  ])('renders %s correctly', (_, options) => {
    render(Avatar, { ...options })

    expect(document.querySelector('span')).toMatchSnapshot()
  })
})
