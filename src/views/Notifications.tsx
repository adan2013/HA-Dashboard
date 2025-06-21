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
import NotificationActionButton from '../components/notifications/NotificationActionButton'

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
  initialData?: NotificationsServiceData
}

const DndIsModeActive = () => (
  <div className="my-4 text-center font-extrabold text-gray-400">
    DND MODE IS ACTIVE
  </div>
)

const Notifications = ({
  isWidget,
  initialData = null
}: NotificationsViewProps) => {
  const [state, setState] = useState<NotificationsServiceData>(initialData)
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
    if (isWidget) {
      return (
        <div className="flex h-full p-3 text-gray-400">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="mb-2 text-3xl">
              {new Date().toLocaleString('default', {
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div className="grid w-full max-w-[600px] grid-cols-7 gap-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <div
                  key={day}
                  className="p-2 text-center font-bold text-gray-200"
                >
                  {day}
                </div>
              ))}
              {(() => {
                const date = new Date()
                const firstDay = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  1
                )
                const lastDay = new Date(
                  date.getFullYear(),
                  date.getMonth() + 1,
                  0
                )
                const days = []

                // Add empty cells for days before first of month
                let firstDayIndex = firstDay.getDay() - 1
                if (firstDayIndex === -1) firstDayIndex = 6 // Handle Sunday
                for (let i = 0; i < firstDayIndex; i++) {
                  days.push(<div key={`empty-${i}`} className="p-4" />)
                }

                // Add cells for each day of month
                for (let i = 1; i <= lastDay.getDate(); i++) {
                  const isToday = i === date.getDate()
                  days.push(
                    <div
                      key={i}
                      className={`rounded border border-gray-500 p-3 text-center text-gray-200 ${
                        isToday ? 'bg-blue-900 font-bold' : ''
                      }`}
                    >
                      {i}
                    </div>
                  )
                }

                return days
              })()}
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className="mt-20 text-center font-extrabold text-gray-400">
        <div className="mb-2">
          <CheckBoxOutlinedIcon className="!text-8xl" />
        </div>
        NO ACTIVE NOTIFICATIONS
        {state?.dndMode && <DndIsModeActive />}
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1000px] p-2">
      {isWidget && (
        <div className="relative mb-4 text-3xl font-bold">
          {`${state.active.length} ACTIVE ${
            state.active.length > 1 ? 'NOTIFICATIONS' : 'NOTIFICATION'
          }`}
          <Link to="/notifications">
            <div className="absolute right-0 top-0 flex h-full cursor-pointer items-center rounded bg-gray-600 px-3 text-sm hover:bg-blue-800">
              OPEN FULL VIEW
            </div>
          </Link>
        </div>
      )}
      {state.active.map(n => (
        <div
          key={n.id}
          data-testid={`notification-light-border-${n.id}`}
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
              data-testid={`notification-close-button-${n.id}`}
              className="absolute right-3 top-3 cursor-pointer rounded-full p-2 !text-4xl text-gray-400 hover:bg-gray-600 hover:text-white lg:!text-5xl"
            />
          )}
          <div className="mt-3 text-right text-sm font-light text-gray-200">
            {formatTime(n.createdAt)}
          </div>
          <NotificationActionButton id={n.id} />
        </div>
      ))}
      {state.dndMode && <DndIsModeActive />}
    </div>
  )
}

export default Notifications
