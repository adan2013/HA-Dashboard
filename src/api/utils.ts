export interface SocketMessageInterface {
  type: string
  id?: number
}

export interface EntityAttributeInterface {
  friendly_name: string
  linkquality: number
}

export type MessageOptions = {
  includeId: boolean
  resultCallback: (result: any) => void
  eventCallback: (event: any) => void
}

export type EntityState = {
  id: string
  state: string
  lastChanged: string
  lastUpdated: string
  attributes: EntityAttributeInterface
}

export type HomeAssistantConnectionState =
  | 'synced'
  | 'authorized'
  | 'connected'
  | 'disconnected'
  | 'authError'

export type ListenerRemover = () => void

export type EntityListenerCallback = (
  entity: EntityState,
  connection: HomeAssistantConnectionState
) => void

export type ConnectionStatusListenerCallback = (
  state: HomeAssistantConnectionState
) => void

export const getEnvVar = (name: string): string =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import.meta.env[name] || ''

export const mapEntityState = (haEntity: any): EntityState => ({
  id: haEntity.entity_id,
  state: haEntity.state,
  lastChanged: haEntity.last_changed,
  lastUpdated: haEntity.last_updated,
  attributes: haEntity.attributes
})
