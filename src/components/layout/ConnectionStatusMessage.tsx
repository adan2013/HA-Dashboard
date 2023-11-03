import { useEffect, useState } from 'react'
import clsx from 'clsx'
import {
  BackendConnectionState,
  HomeAssistantConnectionState
} from '../../api/utils'
import { useBackendStatus, useHomeAssistantStatus } from '../../api/hooks'

const getHomeAssistantIconStyle = (
  ha: HomeAssistantConnectionState
): string => {
  switch (ha) {
    case 'synced':
    case 'authorized':
      return 'bg-green-500'
    case 'connected':
      return 'bg-yellow-600 animate-pulse'
    default:
      return 'bg-red-600 animate-pulse'
  }
}

const getBackendIconStyle = (backend: BackendConnectionState): string => {
  switch (backend) {
    case 'synced':
      return 'bg-green-500'
    case 'connected':
      return 'bg-yellow-600 animate-pulse'
    default:
      return 'bg-red-600 animate-pulse'
  }
}

const ConnectionStatusMessage = () => {
  const [visible, setVisible] = useState<boolean>(true)
  const haStatus = useHomeAssistantStatus()
  const backendStatus = useBackendStatus()

  useEffect(() => {
    setVisible(haStatus !== 'synced' || backendStatus !== 'synced')
  }, [haStatus, backendStatus])

  if (!visible) return null
  const haColor = getHomeAssistantIconStyle(haStatus)
  const backendColor = getBackendIconStyle(backendStatus)

  return (
    <div className="fixed right-1/2 top-0 z-10 translate-x-1/2 rounded-b-lg bg-black px-3 py-2 text-sm text-white">
      <div
        className={clsx('mr-2 inline-block h-3 w-3 rounded-full', haColor)}
      />
      HA
      <div
        className={clsx(
          'ml-4 mr-2 inline-block h-3 w-3 rounded-full',
          backendColor
        )}
      />
      BE
    </div>
  )
}

export default ConnectionStatusMessage
