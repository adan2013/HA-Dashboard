export type TimeOfDay = {
  hour: number
  minute: number
}

export type TimeRange = {
  start: TimeOfDay
  end: TimeOfDay
}

export const DEFAULT_TIME_RANGE = '09:00-15:00'

const TIME_RANGE_PATTERN =
  /^([01]\d|2[0-3]):([0-5]\d)-([01]\d|2[0-3]):([0-5]\d)$/

export const parseTimeRange = (value?: string | null): TimeRange | null => {
  if (!value) return null
  const match = TIME_RANGE_PATTERN.exec(value)
  if (!match) return null

  const [, startHour, startMinute, endHour, endMinute] = match
  if (startHour === endHour && startMinute === endMinute) return null

  return {
    start: { hour: Number(startHour), minute: Number(startMinute) },
    end: { hour: Number(endHour), minute: Number(endMinute) }
  }
}

export const formatTime = ({ hour, minute }: TimeOfDay) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

export const formatTimeRange = ({ start, end }: TimeRange) =>
  `${formatTime(start)}-${formatTime(end)}`

const wrap = (value: number, size: number) => ((value % size) + size) % size

export const shiftTime = (
  value: TimeOfDay,
  unit: 'hour' | 'minute',
  amount: number
): TimeOfDay =>
  unit === 'hour'
    ? { ...value, hour: wrap(value.hour + amount, 24) }
    : { ...value, minute: wrap(value.minute + amount, 60) }
