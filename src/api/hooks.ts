import { useEffect, useState } from 'react'
import {
  HomeAssistantConnectionState,
  EntityState,
  BatteryState,
  extractDeviceNameFromFriendlyName
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

export const useHomeAssistantBatteryEntities = () => {
  const [state, setState] = useState<BatteryState[]>(null)
  const ha = useHomeAssistant()

  useEffect(() => {
    const batteryPoweredEntities = ha.entities
      .filter(entity => entity.attributes.battery > 0)
      .map(entity => ({
        friendlyName: extractDeviceNameFromFriendlyName(
          entity.attributes.friendly_name
        ),
        value: entity.attributes.battery
      }))
      .sort((a, b) => a.value - b.value)
    const uniqueEntities = []
    batteryPoweredEntities.forEach(entity => {
      if (!uniqueEntities.some(ue => ue.friendlyName === entity.friendlyName)) {
        uniqueEntities.push(entity)
      }
    })
    setState(uniqueEntities)
  }, [ha])

  return state
}
