export type Gradient = 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'red'

export const gradients: Record<Gradient, string> = {
  purple: 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500',
  blue: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
  green: 'bg-gradient-to-br from-emerald-500 via-green-500 to-lime-500',
  orange: 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500',
  pink: 'bg-gradient-to-br from-pink-500 via-rose-500 to-red-500',
  red: 'bg-gradient-to-br from-red-500 via-pink-500 to-rose-500',
}
