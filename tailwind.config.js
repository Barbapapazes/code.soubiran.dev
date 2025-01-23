import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'

export const plugins = [
  iconsPlugin({
    collections: getIconCollections(['ph']),
  }),
]
