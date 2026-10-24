import { NotificationId, NotificationPayload } from './notificationContract'

export { NotificationLight, NotificationPayload } from './notificationContract'

export type NotificationsServiceData = {
  active: NotificationPayload[]
  availableIds: NotificationId[]
  dndMode: boolean
}
