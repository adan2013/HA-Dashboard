import { useEffect, useState } from 'react'
import {
  HomeAssistantConnectionState,
  EntityState,
  extractDeviceNameFromFriendlyName,
  ZigbeeEntityState
} from './utils'
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

export type SortMethod = 'battery' | 'signal' | 'name'

export const useHomeAssistantZigBeeEntities = (
  sortBy: SortMethod = 'name'
): ZigbeeEntityState[] => {
  const [state, setState] = useState<ZigbeeEntityState[]>(null)
  const ha = useHomeAssistant()

  useEffect(() => {
    const entities: ZigbeeEntityState[] = ha.entities
      .filter(entity => {
        switch (sortBy) {
          case 'battery':
            return entity.attributes.battery > 0
          case 'signal':
            return entity.attributes.linkquality > 0
          default:
            return (
              entity.attributes.battery > 0 || entity.attributes.linkquality > 0
            )
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
      if (!uniqueEntities.some(ue => ue.friendlyName === entity.friendlyName)) {
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
  }, [ha, sortBy])

  return state
}
