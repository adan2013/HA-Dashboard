export type ChartData = {
  id: string
  name: string
  value: number
}

export const valueInRange = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)
