import type { RenderOptions } from '@testing-library/vue'
import Avatar from '@/ui/components/Avatar.vue'
import AvatarGroup from '@/ui/components/AvatarGroup.vue'
import theme from '@/ui/theme/avatar-group'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'

const AvatarGroupWrapper = defineComponent({
  components: {
    Avatar,
    AvatarGroup,
  },
  template: `<AvatarGroup>
  <Avatar src="https://github.com/vuejs.png" alt="Vue.js" />
  <Avatar src="https://github.com/nuxt.png" alt="Nuxt" />
  <Avatar src="https://github.com/unjs.png" alt="UnJS" />
</AvatarGroup>`,
})

describe('avatar group', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each<[string, RenderOptions<typeof AvatarGroup>]>([
    // Props
    ['with max', { props: { max: 2 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'justify-start' } }],
    ['with ui', { props: { ui: { base: 'rounded-lg' } } }],
    // Slots
    ['with default slot', {}],
  ])('renders %s correctly', (_, options) => {
    render(AvatarGroupWrapper, { attrs: { 'data-testid': 'avatar-group' }, ...options })

    expect(screen.getByTestId('avatar-group')).toMatchSnapshot()
  })
})
