import { NavigateFunction } from 'react-router-dom'
import BackendWebSocketAPI from '../../api/BackendWebSocketAPI'

export type NotificationActionContext = {
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
