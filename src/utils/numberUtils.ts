export const clampValue = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)
