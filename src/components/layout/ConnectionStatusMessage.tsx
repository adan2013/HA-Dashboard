import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { HomeAssistantConnectionState } from '../../api/utils'
import { useBackendStatus, useHomeAssistantStatus } from '../../api/hooks'

const getHomeAssistantColor = (ha: HomeAssistantConnectionState): string => {
  switch (ha) {
    case 'synced':
    case 'authorized':
      return 'bg-green-500'
    case 'connected':
      return 'bg-yellow-600'
    default:
      return 'bg-red-600'
  }
}

const getBackendColor = (backend: boolean): string =>
  backend ? 'bg-green-500' : 'bg-red-600'

const ConnectionStatusMessage = () => {
  const [visible, setVisible] = useState<boolean>(true)
  const haStatus = useHomeAssistantStatus()
  const backendStatus = useBackendStatus()

  useEffect(() => {
    const isConnectedToHA = haStatus === 'authorized' || haStatus === 'synced'
    setVisible(!isConnectedToHA || !backendStatus)
  }, [haStatus, backendStatus])

  if (!visible) return null
  const haColor = getHomeAssistantColor(haStatus)
  const backendColor = getBackendColor(backendStatus)
  console.log(haStatus, backendStatus) // TODO console log
  return (
    <div className="fixed right-1/2 top-0 z-10 translate-x-1/2 rounded-b-lg bg-black px-3 py-2 text-sm text-white">
      <div
        className={clsx(
          'mr-2 inline-block h-3 w-3 animate-pulse rounded-full',
          haColor
        )}
      />
      HA
      <div
        className={clsx(
          'ml-4 mr-2 inline-block h-3 w-3 animate-pulse rounded-full',
          backendColor
        )}
      />
      BE
    </div>
  )
}

export default ConnectionStatusMessage
