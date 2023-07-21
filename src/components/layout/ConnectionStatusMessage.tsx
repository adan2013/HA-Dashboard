import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { HomeAssistantConnectionState } from '../../api/utils'
import { useHomeAssistantStatus } from '../../api/hooks'

type StyleType = {
  color: string
  label: string
}

const getStyle = (status: HomeAssistantConnectionState): StyleType => {
  switch (status) {
    case 'synced':
    case 'authorized':
      return {
        color: 'bg-green-500',
        label: 'Connected'
      }
    case 'connected':
      return {
        color: 'bg-yellow-600',
        label: 'Connecting'
      }
    case 'authError':
      return {
        color: 'bg-red-600',
        label: 'Unauthorized'
      }
    default:
      return {
        color: 'bg-red-600',
        label: 'Disconnected'
      }
  }
}

const VISIBILITY_TIMEOUT = 2000

const ConnectionStatusMessage = () => {
  const [visible, setVisible] = useState<boolean>(true)
  const status = useHomeAssistantStatus()

  useEffect(() => {
    setVisible(true)
    if (status === 'authorized') {
      setTimeout(() => setVisible(false), VISIBILITY_TIMEOUT)
    }
  }, [status])

  if (!visible) return null
  const { color, label } = getStyle(status)

  return (
    <div className="fixed right-1/2 top-0 z-10 translate-x-1/2 rounded-b-lg bg-black px-3 py-2 text-sm text-white">
      <div
        className={clsx(
          'mr-2 inline-block h-3 w-3 animate-pulse rounded-full',
          color
        )}
      />
      {label}
    </div>
  )
}

export default ConnectionStatusMessage
