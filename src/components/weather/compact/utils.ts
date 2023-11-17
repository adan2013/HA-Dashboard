import { ShortForecast, LongForecast } from '../../../api/backend/weatherTypes'

export const getDayOfWeekName = (date: Date): string => {
  const dayOfWeek = date.getDay()
  switch (dayOfWeek) {
    case 0:
      return 'Sun'
    case 1:
      return 'Mon'
    case 2:
      return 'Tue'
    case 3:
      return 'Wed'
    case 4:
      return 'Thu'
    case 5:
      return 'Fri'
    case 6:
      return 'Sat'
    default:
      return '-'
  }
}

export const removePastHours = (hours: ShortForecast[]): ShortForecast[] => {
  if (!hours) return null
  const now = new Date().getTime()
  return hours.filter(h => new Date(h.timestamp).getTime() > now)
}

export const removePastDays = (days: LongForecast[]): LongForecast[] => {
  if (!days) return null
  const endOfCurrentDay = new Date().setHours(23, 59, 59)
  return days.filter(d => {
    const date = new Date(d.timestamp).getTime()
    return date > endOfCurrentDay
  })
}

export const getBarColorForHumidity = (humidity: number): string => {
  if (humidity > 40 && humidity < 60) return 'bg-green-500'
  if (humidity > 20 && humidity < 80) return 'bg-yellow-500'
  if (humidity > 5 && humidity < 95) return 'bg-orange-500'
  return 'bg-red-500'
}

export const getBarColorForWindSpeed = (speed: number): string => {
  if (speed < 20) return 'bg-green-500'
  if (speed < 40) return 'bg-yellow-500'
  if (speed < 60) return 'bg-orange-500'
  if (speed < 80) return 'bg-red-500'
  return 'bg-purple-500'
}

export const getBarColorForUltraViolet = (uvi: number): string => {
  switch (uvi) {
    case 0:
    case 1:
    case 2:
      return 'bg-green-500'
    case 3:
    case 4:
    case 5:
      return 'bg-yellow-500'
    case 6:
    case 7:
      return 'bg-orange-500'
    case 8:
    case 9:
    case 10:
      return 'bg-red-500'
    default:
      return 'bg-purple-500'
  }
}

export const getBarColorForAirQuality = (aqi: number): string => {
  switch (aqi) {
    case 1:
      return 'bg-green-500'
    case 2:
      return 'bg-yellow-500'
    case 3:
      return 'bg-orange-500'
    case 4:
      return 'bg-red-500'
    default:
      return 'bg-purple-500'
  }
}
