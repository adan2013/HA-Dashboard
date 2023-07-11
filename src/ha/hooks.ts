import { useEffect, useState } from 'react'
import { ConnectionStatus, EntityState } from './utils'
import { useHomeAssistant } from '../contexts/HomeAssistantContext'

export const useHomeAssistantStatus = (): ConnectionStatus => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')
  const ha = useHomeAssistant()

  useEffect(
    () => ha.subscribeToStatus((_, newStatus) => setStatus(newStatus)),
    [ha]
  )

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
      ha.subscribeToEntity(entityName, data => {
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
