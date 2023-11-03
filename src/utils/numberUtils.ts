export const clampValue = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const addLeadingZero = (value: number): string =>
  value < 10 ? `0${value}` : `${value}`
