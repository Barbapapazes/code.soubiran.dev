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
}
