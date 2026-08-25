import type { CodeImageGradient } from '@/shared/code-image'

export { codeImageGradientValues as gradientValues } from '@/shared/code-image'
export type { CodeImageGradient as Gradient } from '@/shared/code-image'

export const gradients: Record<CodeImageGradient, string> = {
  purple: 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
  blue: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
  green: 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500',
  orange: 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500',
  pink: 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-500',
  red: 'bg-gradient-to-br from-red-500 via-pink-500 to-rose-500',
  sunset: 'bg-gradient-to-br from-rose-500 via-orange-400 to-amber-300',
  midnight: 'bg-gradient-to-br from-slate-950 via-indigo-900 to-violet-700',
  aurora: 'bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500',
  lagoon: 'bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600',
}

export const gradientNames: Record<CodeImageGradient, string> = {
  purple: 'Purple Dream',
  blue: 'Ocean Breeze',
  green: 'Emerald Meadow',
  orange: 'Golden Hour',
  pink: 'Cotton Candy',
  red: 'Crimson Bloom',
  sunset: 'Sunset Glow',
  midnight: 'Midnight Sky',
  aurora: 'Aurora Lights',
  lagoon: 'Tropical Lagoon',
}
