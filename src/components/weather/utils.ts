import { DailyWeather, HourlyWeather } from '../../api/backend/weatherTypes'

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

export const removePastHours = (hours: HourlyWeather[]): HourlyWeather[] => {
  if (!hours) return null
  const now = new Date().getTime()
  return hours.filter(h => new Date(h.timestamp).getTime() > now)
}

export const removePastDays = (days: DailyWeather[]): DailyWeather[] => {
  if (!days) return null
  const endOfCurrentDay = new Date().setHours(23, 59, 59)
  return days.filter(d => {
    const date = new Date(d.timestamp).getTime()
    return date > endOfCurrentDay
  })
}
