import { useEffect, useState } from 'react'
import { useHomeAssistantEntity } from '../../../../api/hooks'
import { parseSchedule, ScheduleDay } from '../../../../utils/radiatorSchedule'

const useDaySchedule = (prefix: string, day: ScheduleDay) => {
  const entityId = `${prefix}_${day}`
  const entity = useHomeAssistantEntity(entityId)
  const [saved, setSaved] = useState<string>()
  const remote = entity.entityState?.state
  // Keep a successful write visible while waiting for HA's state event.
  // Any subsequent remote update wins; there is no conflict resolution.
  useEffect(() => setSaved(undefined), [remote, entityId, entity.isUnavailable])
  const value = saved ?? remote
  const points = typeof value === 'string' ? parseSchedule(value) : null
  let error: string | undefined
  if (entity.isLoading) error = 'Loading schedule…'
  else if (entity.isUnavailable) error = 'Schedule unavailable'
  else if (!points) error = 'Invalid schedule data'
  return { day, entityId, points, error, markSaved: setSaved }
}

const useWeeklySchedules = (prefix: string) => [
  useDaySchedule(prefix, 'monday'),
  useDaySchedule(prefix, 'tuesday'),
  useDaySchedule(prefix, 'wednesday'),
  useDaySchedule(prefix, 'thursday'),
  useDaySchedule(prefix, 'friday'),
  useDaySchedule(prefix, 'saturday'),
  useDaySchedule(prefix, 'sunday')
]

export default useWeeklySchedules
