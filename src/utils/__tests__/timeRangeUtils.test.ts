import { formatTimeRange, parseTimeRange, shiftTime } from '../timeRangeUtils'

describe('timeRangeUtils', () => {
  it('parses and formats a strict time range', () => {
    const range = parseTimeRange('09:05-15:45')
    expect(range).toEqual({
      start: { hour: 9, minute: 5 },
      end: { hour: 15, minute: 45 }
    })
    expect(formatTimeRange(range)).toBe('09:05-15:45')
  })

  it.each([
    '9:00-15:00',
    '09:00 - 15:00',
    '24:00-15:00',
    '09:60-15:00',
    '09:00-09:00'
  ])('rejects invalid range %s', value => {
    expect(parseTimeRange(value)).toBeNull()
  })

  it('wraps hours and minutes independently', () => {
    expect(shiftTime({ hour: 23, minute: 59 }, 'hour', 1)).toEqual({
      hour: 0,
      minute: 59
    })
    expect(shiftTime({ hour: 12, minute: 59 }, 'minute', 1)).toEqual({
      hour: 12,
      minute: 0
    })
    expect(shiftTime({ hour: 12, minute: 2 }, 'minute', -5)).toEqual({
      hour: 12,
      minute: 57
    })
  })
})
