import { NavigateFunction } from 'react-router-dom'
import HomeAssistantWebSocketAPI from '../../api/HomeAssistantWebSocketAPI'
import BackendWebSocketAPI from '../../api/BackendWebSocketAPI'

export type NotificationActionContext = {
  homeAssistant: HomeAssistantWebSocketAPI
  backend: BackendWebSocketAPI
  navigate: NavigateFunction
}

export type NotificationAction = {
  id: string
  text: string
  confirmationRequired?: boolean
  confirmationMessage?: string
  actionIsDanger?: boolean
  action: (context: NotificationActionContext) => void
}
