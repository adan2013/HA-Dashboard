export interface SocketMessageInterface {
  type: string
  id?: number
}

export interface EntityAttributeInterface {
  brightness?: number
  color_temp_kelvin?: number
  min_color_temp_kelvin?: number
  max_color_temp_kelvin?: number
  battery?: number
  current_temperature?: number
  temperature?: number
  fan_mode?: string
  fan_modes?: string[]
  entity_picture?: string
  friendly_name: string
  linkquality?: number
}

export type EntityState = {
  id: string
  state: string
  lastChanged: string
  lastUpdated: string
  attributes: EntityAttributeInterface
}

export type ZigbeeEntityState = {
  entity: EntityState
  friendlyName: string
  battery: number
  signal: number
}

export type HomeAssistantConnectionState =
  | 'synced'
  | 'authorized'
  | 'connected'
  | 'disconnected'
  | 'authError'

export type BackendConnectionState = 'synced' | 'connected' | 'disconnected'

export type BackendAuthenticationState =
  | 'missingToken'
  | 'connecting'
  | 'authenticated'
  | 'invalidToken'

export type SensorHistoryItem = {
  id: string | number
  time: string
  value: number
}

export type ListenerRemover = () => void

export type EntityListenerCallback = (
  entity: EntityState,
  connection: HomeAssistantConnectionState
) => void

export type HomeAssistantConnectionStateListenerCallback = (
  state: HomeAssistantConnectionState
) => void

export type BackendConnectionStateListenerCallback = (
  state: BackendConnectionState
) => void

export const extractDeviceNameFromFriendlyName = (name: string): string => {
  if (!name) return ''
  const parts = name.split(' ')
  if (parts.length > 0) return parts[0]
  return name
}
