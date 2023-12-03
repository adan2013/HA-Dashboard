import { useEffect, useState } from 'react'
import { useBackend } from '../../contexts/BackendContext'

const NotificationDot = () => {
  const [count, setCount] = useState(0)
  const backend = useBackend()

  useEffect(
    () =>
      backend?.subscribeToServiceData(data => {
        if (data?.notifications) {
          setCount(data.notifications.active.length || 0)
        }
      }),
    [backend]
  )

  if (count > 0) {
    return (
      <div className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-600" />
    )
  }
  return null
}

export default NotificationDot
