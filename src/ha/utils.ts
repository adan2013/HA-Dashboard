export interface SocketMessageInterface {
  type: string
  id?: number
}

export interface EntityAttributeInterface {
  friendly_name: string
}

export type MessageOptions = {
  includeId: boolean
  resultCallback: (result: any) => void
  eventCallback: (event: any) => void
}

export type SocketListener = {
  msgId: number
  callback?: (callbackData: any) => void
}

export type EntityState = {
  id: string
  state: string
  lastChanged: string
  lastUpdated: string
  attributes: EntityAttributeInterface
}

export type ConnectionStatus =
  | 'authorized'
  | 'connected'
  | 'disconnected'
  | 'authError'

export type ListenerRemover = () => void

export type UpdateListenerCallback = (
  entity: EntityState,
  connection: ConnectionStatus
) => void

export type UpdateListener = {
  id: 'connectionStatus' | string
  callback: UpdateListenerCallback
}

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