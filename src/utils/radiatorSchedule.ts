export const SCHEDULE_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
] as const

export type ScheduleDay = (typeof SCHEDULE_DAYS)[number]
export type SchedulePoint = { minutes: number; temperature: number }

export const MAX_SCHEDULE_POINTS = 6
export const dayLabel = (day: ScheduleDay) =>
  day[0].toUpperCase() + day.slice(1)

export const scheduleTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(
    minutes % 60
  ).padStart(2, '0')}`

// Empty is a valid unconfigured day; null means malformed data.
export const parseSchedule = (value: string): SchedulePoint[] | null => {
  if (!value.trim()) return []
  const points: SchedulePoint[] = []
  const tokens = value.trim().split(/\s+/)
  for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
    const token = tokens[tokenIndex]
    const match = /^(\d{2}):(\d{2})\/(\d+(?:\.\d+)?)$/.exec(token)
    if (!match) return null
    const [, hour, minute, temp] = match
    const minutes = Number(hour) * 60 + Number(minute)
    const temperature = Number(temp)
    if (
      Number(hour) > 23 ||
      Number(minute) > 59 ||
      temperature < 4 ||
      temperature > 35 ||
      !Number.isInteger(temperature * 2)
    )
      return null
    const previous = points.at(-1)
    if (previous?.minutes === minutes) {
      if (previous.temperature !== temperature) return null
    } else {
      if (previous && previous.minutes > minutes) return null
      points.push({ minutes, temperature })
    }
  }
  if (points[0].minutes !== 0 || points.length > MAX_SCHEDULE_POINTS)
    return null
  return points
}

export const serializeSchedule = (points: SchedulePoint[]) =>
  points
    .map(point => `${scheduleTime(point.minutes)}/${point.temperature}`)
    .join(' ')

export const initialSchedule = (points: SchedulePoint[]): SchedulePoint[] =>
  points.length
    ? points.map(point => ({ ...point }))
    : [{ minutes: 0, temperature: 20 }]

export const canMoveSchedulePoint = (
  points: SchedulePoint[],
  index: number,
  minutes: number
) =>
  index > 0 &&
  index < points.length &&
  minutes > points[index - 1].minutes &&
  minutes < (points[index + 1]?.minutes ?? 1440)

export const newSchedulePoint = (
  points: SchedulePoint[],
  index: number
): SchedulePoint | null => {
  if (!points[index] || points.length >= MAX_SCHEDULE_POINTS) return null
  const start = points[index].minutes
  const end = points[index + 1]?.minutes ?? 1440
  const first = (Math.floor(start / 5) + 1) * 5
  const last = (Math.ceil(end / 5) - 1) * 5
  if (first > last) return null
  return {
    minutes: Math.max(
      first,
      Math.min(last, Math.round((start + end) / 10) * 5)
    ),
    temperature: points[index].temperature
  }
}

export const scheduleTemperatureRange = (points: SchedulePoint[]) => {
  const temperatures = points.map(point => point.temperature)
  const min = Math.min(...temperatures)
  const max = Math.max(...temperatures)
  return min === max
    ? { min: Math.floor(min - 3), max: Math.ceil(max + 3) }
    : { min: Math.floor(min) - 1, max: Math.ceil(max) + 1 }
}
