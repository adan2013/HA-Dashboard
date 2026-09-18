import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useBackend } from '../../contexts/BackendContext'
import { NotificationLight } from '../../api/backend/notificationTypes'

type NotificationDotColor = NotificationLight | 'white'

const getBackgroundColor = (light: NotificationDotColor) => {
  switch (light) {
    case 'red':
    case 'redFlashing':
      return 'bg-red-600'
    case 'yellow':
      return 'bg-yellow-600'
    case 'green':
      return 'bg-green-600'
    case 'blue':
    case 'blueFlashing':
      return 'bg-blue-600'
    case 'purple':
      return 'bg-purple-600'
    default:
      return 'bg-white'
  }
}

const NotificationDot = () => {
  const [color, setColor] = useState<NotificationDotColor>()
  const backend = useBackend()

  useEffect(
    () =>
      backend?.subscribeToServiceData(data => {
        if (data?.notifications) {
          const { active } = data.notifications
          const mostImportantColor = active.find(
            notification => notification.light
          )?.light
          setColor(
            active.length > 0 ? mostImportantColor || 'white' : undefined
          )
        }
      }),
    [backend]
  )

  if (color) {
    return (
      <div
        className={clsx(
          'absolute right-0 top-0 h-2 w-2 rounded-full',
          getBackgroundColor(color)
        )}
        data-testid="notification-dot"
      />
    )
  }
  return null
}

export default NotificationDot
