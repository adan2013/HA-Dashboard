import { clampValue } from '../numberUtils'

describe('numberUtils', () => {
  it('should clamp a number', () => {
    expect(clampValue(-2, -1, 2)).toBe(-1)
    expect(clampValue(-1, -1, 2)).toBe(-1)
    expect(clampValue(0, -1, 2)).toBe(0)
    expect(clampValue(1, -1, 2)).toBe(1)
    expect(clampValue(2, -1, 2)).toBe(2)
    expect(clampValue(3, -1, 2)).toBe(2)
  })
})
