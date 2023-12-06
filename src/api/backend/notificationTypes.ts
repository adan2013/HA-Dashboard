type Priority = 'low' | 'medium' | 'high'

export type NotificationLight =
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'redFlashing'
  | 'blueFlashing'

export type NotificationPayload = {
  id: string
  title: string
  description: string
  extraInfo?: string
  priorityOrder: Priority
  light?: NotificationLight
  canBeDismissed?: boolean
  ignoreDND?: boolean
  createdAt: string
}

export type NotificationsServiceData = {
  active: NotificationPayload[]
  availableIds: string[]
  dndMode: boolean
}
