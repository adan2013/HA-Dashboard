import { useEffect, useState } from 'react'
import { HomeAssistantConnectionState, EntityState } from './utils'
import { useHomeAssistant } from '../contexts/HomeAssistantContext'

export const useHomeAssistantStatus = (): HomeAssistantConnectionState => {
  const [status, setStatus] =
    useState<HomeAssistantConnectionState>('disconnected')
  const ha = useHomeAssistant()

  useEffect(() => ha?.subscribeToConnectionState(setStatus), [ha])

  return status
}

export type HomeAssistantEntityData = {
  entityState: EntityState
  isUnavailable: boolean
}

export const useHomeAssistantEntity = (
  entityName: string
): HomeAssistantEntityData => {
  const [state, setState] = useState<HomeAssistantEntityData>({
    entityState: null,
    isUnavailable: true
  })
  const ha = useHomeAssistant()

  useEffect(
    () =>
      ha?.subscribeToEntity(entityName, data => {
        setState({
          entityState: data,
          isUnavailable:
            !data || data.state === 'unavailable' || data.state === 'unknown'
        })
      }),
    [entityName, ha]
  )

  return state
}
