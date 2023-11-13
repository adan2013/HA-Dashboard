import { removePastDays, removePastHours } from '../compact/utils'
import {
  hourlyForecastMock,
  dailyForecastMock
} from '../../../api/backend/weatherMocks'

describe('weather utils', () => {
  it.each([
    [2, '2023-12-31T23:59:00'],
    [1, '2024-01-01T00:01:00'],
    [0, '2024-01-01T01:00:00']
  ])(
    'should remove past hours from the forecast and return %i items for date %s',
    (length, currentDate) => {
      jest.useFakeTimers().setSystemTime(new Date(currentDate))
      const response = removePastHours(hourlyForecastMock)
      expect(response.length).toBe(length)
    }
  )

  it.each([
    [2, '2023-12-31T08:00:00'],
    [1, '2024-01-01T14:00:00'],
    [1, '2024-01-01T20:00:00'],
    [0, '2024-01-02T00:01:00']
  ])(
    'should remove past days from the forecast and return %i items for date %s',
    (length, currentDate) => {
      jest.useFakeTimers().setSystemTime(new Date(currentDate))
      const response = removePastDays(dailyForecastMock)
      expect(response.length).toBe(length)
    }
  )
})
