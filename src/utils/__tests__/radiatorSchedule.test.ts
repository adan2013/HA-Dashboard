import {
  canMoveSchedulePoint,
  initialSchedule,
  newSchedulePoint,
  parseSchedule,
  scheduleTemperatureRange,
  serializeSchedule
} from '../radiatorSchedule'

describe('TRVZB schedule', () => {
  it('collapses legacy duplicate transitions without changing the heating program', () => {
    const points = parseSchedule(
      '00:00/16 07:00/19 10:00/16 10:00/16 17:00/19 23:00/16'
    )
    expect(points).toHaveLength(5)
    expect(serializeSchedule(points)).toBe(
      '00:00/16 07:00/19 10:00/16 17:00/19 23:00/16'
    )
  })

  it.each([
    '00:00/16 10:00/16 10:00/19',
    '07:00/19',
    '00:00/20 24:00/20',
    '00:00/20 10:60/20',
    '00:00/20 12:00/21 11:00/22',
    '00:00/3.5',
    '00:00/35.5',
    '00:00/20.2',
    'unavailable',
    '00:00/20 01:00/20 02:00/20 03:00/20 04:00/20 05:00/20 06:00/20'
  ])('rejects malformed or unsupported schedule %s', value => {
    expect(parseSchedule(value)).toBeNull()
  })

  it('distinguishes an empty day and initializes it only for editing', () => {
    expect(parseSchedule('')).toEqual([])
    expect(initialSchedule([])).toEqual([{ minutes: 0, temperature: 20 }])
  })

  it('inserts after the selected point, on the five-minute grid, inheriting its temperature', () => {
    const points = parseSchedule('00:00/16 07:05/19 23:00/16')
    expect(newSchedulePoint(points, 0)).toEqual({
      minutes: 215,
      temperature: 16
    })
    expect(newSchedulePoint(points, 2)).toEqual({
      minutes: 1410,
      temperature: 16
    })
    expect(newSchedulePoint(parseSchedule('00:00/20 23:55/20'), 1)).toBeNull()
    expect(newSchedulePoint(parseSchedule('00:00/20 00:05/20'), 0)).toBeNull()
    expect(
      newSchedulePoint(
        parseSchedule('00:00/20 01:00/20 02:00/20 03:00/20 04:00/20 05:00/20'),
        0
      )
    ).toBeNull()
  })

  it('locks midnight and prevents crossing or equalling either neighbour or the day boundary', () => {
    const points = parseSchedule('00:00/16 07:00/19 10:00/16')
    expect(canMoveSchedulePoint(points, 0, 5)).toBe(false)
    expect(canMoveSchedulePoint(points, 1, 0)).toBe(false)
    expect(canMoveSchedulePoint(points, 1, 600)).toBe(false)
    expect(canMoveSchedulePoint(points, 1, 595)).toBe(true)
    expect(canMoveSchedulePoint(points, 2, 1440)).toBe(false)
    expect(canMoveSchedulePoint(points, 2, 1435)).toBe(true)
  })

  it('adds a one-degree margin to rounded bounds and keeps the wider flat-day range', () => {
    expect(
      scheduleTemperatureRange(parseSchedule('00:00/16.5 07:00/19.5'))
    ).toEqual({ min: 15, max: 21 })
    expect(scheduleTemperatureRange(parseSchedule('00:00/20'))).toEqual({
      min: 17,
      max: 23
    })
    expect(
      scheduleTemperatureRange(parseSchedule('00:00/20 12:00/20'))
    ).toEqual({ min: 17, max: 23 })
  })
})
