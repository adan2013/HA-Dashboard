import { addLeadingZero, clampValue } from '../numberUtils'

describe('numberUtils', () => {
  it('should clamp a number', () => {
    expect(clampValue(-2, -1, 2)).toBe(-1)
    expect(clampValue(-1, -1, 2)).toBe(-1)
    expect(clampValue(0, -1, 2)).toBe(0)
    expect(clampValue(1, -1, 2)).toBe(1)
    expect(clampValue(2, -1, 2)).toBe(2)
    expect(clampValue(3, -1, 2)).toBe(2)
  })

  it('should add leading zeros', () => {
    expect(addLeadingZero(0)).toBe('00')
    expect(addLeadingZero(8)).toBe('08')
    expect(addLeadingZero(9)).toBe('09')
    expect(addLeadingZero(10)).toBe('10')
    expect(addLeadingZero(11)).toBe('11')
    expect(addLeadingZero(12)).toBe('12')
  })
})
