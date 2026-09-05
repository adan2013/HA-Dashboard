import { useEffect, useState } from 'react'
import {
  HomeAssistantConnectionState,
  EntityState,
  BackendConnectionState,
  BackendAuthenticationState
} from './utils'
import { useBackend } from '../contexts/BackendContext'
import { BatteryState, readBatteryEntity } from '../utils/batteryUtils'

export const useBackendStatus = (): BackendConnectionState => {
  const [status, setStatus] = useState<BackendConnectionState>('disconnected')
  const backend = useBackend()
  useEffect(() => backend?.subscribeToConnectionStatus(setStatus), [backend])
  return status
}

export const useHomeAssistantStatus = (): HomeAssistantConnectionState => {
  const [status, setStatus] =
    useState<HomeAssistantConnectionState>('disconnected')
  const backend = useBackend()

  useEffect(() => backend?.subscribeToHomeAssistantStatus(setStatus), [backend])

  return status
}

export const useBackendAuthenticationState = (): BackendAuthenticationState => {
  const backend = useBackend()
  const [state, setState] = useState<BackendAuthenticationState>('missingToken')
  useEffect(() => backend?.subscribeToAuthenticationState(setState), [backend])
  return state
}

export type HomeAssistantEntityData = {
  entityState: EntityState
  isUnavailable: boolean
}

export const useHomeAssistantEntity = (
  entityId: string
): HomeAssistantEntityData => {
  const [state, setState] = useState<HomeAssistantEntityData>({
    entityState: null,
    isUnavailable: true
  })
  const backend = useBackend()

  useEffect(
    () =>
      backend?.subscribeToEntity(entityId, data => {
        setState({
          entityState: data,
          isUnavailable:
            !data || data.state === 'unavailable' || data.state === 'unknown'
        })
      }),
    [entityId, backend]
  )

  return state
}

export const useHomeAssistantBatteries = (): BatteryState[] => {
  const [state, setState] = useState<BatteryState[]>(null)
  const backend = useBackend()

  useEffect(() => {
    let active = true
    backend
      .getBatteryEntities()
      .then(backendEntities => {
        if (!active) return
        const sortedEntities = backendEntities
          .map(readBatteryEntity)
          .filter((entity): entity is BatteryState => entity !== undefined)
          .sort(
            (a, b) =>
              (a.level ?? Number.MAX_VALUE) -
              (b.level ?? Number.MAX_VALUE)
          )
        setState(sortedEntities)
      })
      .catch(error => console.error('Failed to load battery entities', error))
    return () => {
      active = false
    }
  }, [backend])

  return state
}
