import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useBackend } from '../contexts/BackendContext'
import {
  NotificationLight,
  NotificationsServiceData
} from '../api/backend/notificationTypes'
import { addLeadingZero } from '../utils/numberUtils'

const getBorderColor = (lightType: NotificationLight) => {
  switch (lightType) {
    case 'red':
    case 'redFlashing':
      return 'border-red-600'
    case 'yellow':
      return 'border-yellow-600'
    case 'green':
      return 'border-green-600'
    case 'blue':
    case 'blueFlashing':
      return 'border-blue-600'
    case 'purple':
      return 'border-purple-600'
    default:
      return 'border-transparent'
  }
}

const formatTime = (createAt: string) => {
  const date = new Date(createAt)
  const hours = addLeadingZero(date.getHours())
  const minutes = addLeadingZero(date.getMinutes())
  const day = addLeadingZero(date.getDate())
  const month = addLeadingZero(date.getMonth() + 1)
  const year = date.getFullYear()
  return `${hours}:${minutes} ${day}-${month}-${year}`
}

type NotificationsViewProps = {
  isWidget?: boolean
}

const Notifications = ({ isWidget }: NotificationsViewProps) => {
  const [state, setState] = useState<NotificationsServiceData>(null)
  const backend = useBackend()

  useEffect(
    () =>
      backend?.subscribeToServiceData(data => {
        if (data?.notifications) {
          setState(data.notifications)
        }
      }),
    [backend]
  )

  if (!state || state.active.length === 0) {
    return (
      <div className="text-md mt-20 text-center font-extrabold text-gray-500">
        <div className="mb-2">
          <CheckBoxOutlinedIcon className="!text-8xl" />
        </div>
        NO ACTIVE NOTIFICATIONS
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] p-2">
      {isWidget && (
        <div className="relative mb-4 text-3xl font-bold uppercase">
          {`${state.active.length} active ${
            state.active.length > 1 ? 'notifications' : 'notification'
          }`}
          <Link to="/notifications">
            <div className="absolute right-0 top-0 flex h-full cursor-pointer items-center rounded-lg bg-gray-600 px-3 text-sm uppercase hover:bg-blue-800">
              Open full view
            </div>
          </Link>
        </div>
      )}
      {state.active.map(n => (
        <div
          key={n.id}
          className={clsx(
            'relative mb-6 border-l-8 bg-gray-800 p-4',
            getBorderColor(n.light)
          )}
        >
          <div className="pr-14">
            <div className="text-lg font-bold">{n.title}</div>
            <div className="my-2">{n.description}</div>
            {n.extraInfo && (
              <div className="mt-4 font-light">
                <i>{n.extraInfo}</i>
              </div>
            )}
          </div>
          {n.canBeDismissed && (
            <CloseIcon
              onClick={() => backend?.dismissNotification(n.id)}
              className="absolute right-3 top-3 cursor-pointer rounded-full p-2 !text-4xl text-gray-400 hover:bg-gray-600 hover:text-white lg:!text-5xl"
            />
          )}
          <div className="mt-3 text-right text-sm font-light text-gray-200">
            {formatTime(n.createdAt)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Notifications
