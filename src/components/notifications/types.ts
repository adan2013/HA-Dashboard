import HomeAssistantWebSocketAPI from '../../api/HomeAssistantWebSocketAPI'
import BackendWebSocketAPI from '../../api/BackendWebSocketAPI'

export type NotificationActionContext = {
  homeAssistant: HomeAssistantWebSocketAPI
  backend: BackendWebSocketAPI
}

export type NotificationAction = {
  id: string
  text: string
  confirmationRequired?: boolean
  confirmationMessage?: string
  actionIsDanger?: boolean
  action: (context: NotificationActionContext) => void
}
