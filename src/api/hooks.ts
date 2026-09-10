import { useEffect, useState } from 'react'
import {
  HomeAssistantConnectionState,
  EntityState,
  BackendConnectionState,
  BackendAuthenticationState,
  REQUEST_TIMEOUT_MS
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
  isLoading: boolean
}

export const useHomeAssistantEntity = (
  entityId: string
): HomeAssistantEntityData => {
  const [state, setState] = useState<{
    entityId: string
    entityState: EntityState
    received: boolean
  }>({ entityId, entityState: null, received: false })
  const backend = useBackend()
  const backendStatus = useBackendStatus()
  const haStatus = useHomeAssistantStatus()
  const ready = backendStatus === 'synced' && haStatus === 'synced'

  useEffect(() => {
    setState({ entityId, entityState: null, received: false })
    if (!ready) return undefined
    // A missing response must eventually become unavailable, not an endless skeleton.
    const timeout = window.setTimeout(() => {
      setState({ entityId, entityState: null, received: true })
    }, REQUEST_TIMEOUT_MS)
    const unsubscribe = backend.subscribeToEntity(entityId, data => {
      window.clearTimeout(timeout)
      setState({ entityId, entityState: data, received: true })
    })
    return () => {
      window.clearTimeout(timeout)
      unsubscribe()
    }
  }, [entityId, backend, ready])

  const entityState =
    ready && state.entityId === entityId ? state.entityState : null
  const isLoading =
    backendStatus === 'synced' &&
    haStatus !== 'disconnected' &&
    haStatus !== 'authError' &&
    (state.entityId !== entityId || !state.received)
  return {
    entityState,
    isLoading,
    isUnavailable:
      !entityState ||
      entityState.state === 'unavailable' ||
      entityState.state === 'unknown'
  }
}

export const useHomeAssistantBatteries = (): BatteryState[] => {
  const [state, setState] = useState<BatteryState[]>(null)
  const backend = useBackend()
  const backendStatus = useBackendStatus()
  const haStatus = useHomeAssistantStatus()
  const ready = backendStatus === 'synced' && haStatus === 'synced'

  useEffect(() => {
    setState(null)
    if (!ready) return undefined
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
              (a.level ?? Number.MAX_VALUE) - (b.level ?? Number.MAX_VALUE)
          )
        setState(sortedEntities)
      })
      .catch(error => {
        console.error('Failed to load battery entities', error)
        if (active) setState([])
      })
    return () => {
      active = false
    }
  }, [backend, ready])

  return state
}
