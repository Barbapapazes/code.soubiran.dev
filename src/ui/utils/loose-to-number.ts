export function looseToNumber(val: any): any {
  const n = Number.parseFloat(val)
  return Number.isNaN(n) ? val : n
}
