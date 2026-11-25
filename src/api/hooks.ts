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
import { ServiceManagerStatus } from './backend/backendTypes'

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

export const useServiceValue = <T extends number | string>(
  serviceName: string,
  helperName: string
) => {
  const backend = useBackend()
  const ready = useBackendStatus() === 'synced'
  const [snapshot, setSnapshot] = useState<ServiceManagerStatus>(null)
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    setSnapshot(null)
    setTimedOut(false)
    if (!ready) return undefined
    const timeout = window.setTimeout(
      () => setTimedOut(true),
      REQUEST_TIMEOUT_MS
    )
    const unsubscribe = backend.subscribeToStatusData(data => {
      setSnapshot(data)
      if (data) window.clearTimeout(timeout)
    })
    backend.requestServiceStatus()
    return () => {
      window.clearTimeout(timeout)
      unsubscribe()
    }
  }, [backend, ready])

  const helper = ready
    ? snapshot?.services[serviceName]?.helpers[`value/${helperName}`]
    : null
  const status = helper && 'value' in helper ? helper : null
  const rawValue = status?.value
  const validValue =
    typeof rawValue === 'string' ||
    (typeof rawValue === 'number' && Number.isFinite(rawValue))
  const value = validValue ? (rawValue as T) : null

  return {
    value,
    updatedAt: status?.updatedAt ?? null,
    error:
      status?.error ?? (ready && timedOut ? 'Backend request timed out' : null),
    isLoading: ready && !snapshot && !timedOut,
    isUnavailable: value === null
  }
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
