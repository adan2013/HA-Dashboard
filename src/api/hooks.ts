import { useEffect, useState } from 'react'
import {
  HomeAssistantConnectionState,
  EntityState,
  extractDeviceNameFromFriendlyName,
  ZigbeeEntityState,
  BackendConnectionState,
  BackendAuthenticationState
} from './utils'
import { useBackend } from '../contexts/BackendContext'

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

export type SortMethod = 'battery' | 'signal' | 'name'

export const useHomeAssistantZigbeeEntities = (
  sortBy: SortMethod = 'name'
): ZigbeeEntityState[] => {
  const [state, setState] = useState<ZigbeeEntityState[]>(null)
  const backend = useBackend()

  useEffect(() => {
    let active = true
    backend
      .getEntitiesWithAttribute('linkquality')
      .then(backendEntities => {
        if (!active) return
        const entities: ZigbeeEntityState[] = backendEntities
          .filter(entity => {
            switch (sortBy) {
              case 'battery':
                return (
                  entity.attributes.battery > 0 &&
                  entity.attributes.linkquality > 0
                )
              case 'signal':
                return entity.attributes.linkquality > 0
              default:
                return entity.attributes.linkquality > 0
            }
          })
          .map(entity => ({
            entity,
            friendlyName: extractDeviceNameFromFriendlyName(
              entity.attributes.friendly_name
            ),
            battery: entity.attributes.battery,
            signal: entity.attributes.linkquality
          }))
        const uniqueEntities: ZigbeeEntityState[] = []
        entities.forEach(entity => {
          if (
            !uniqueEntities.some(ue => ue.friendlyName === entity.friendlyName)
          ) {
            uniqueEntities.push(entity)
          }
        })
        const sortedEntities = uniqueEntities.sort((a, b) => {
          switch (sortBy) {
            case 'battery':
              return a.battery - b.battery
            case 'signal':
              return a.signal - b.signal
            default:
              if (a.friendlyName < b.friendlyName) return -1
              if (a.friendlyName > b.friendlyName) return 1
              return 0
          }
        })
        setState(sortedEntities)
      })
      .catch(error => console.error('Failed to load Zigbee entities', error))
    return () => {
      active = false
    }
  }, [backend, sortBy])

  return state
}
