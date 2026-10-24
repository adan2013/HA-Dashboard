import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import NotificationCard from '../components/notifications/NotificationCard'
import { useBackend } from '../contexts/BackendContext'
import { NotificationsServiceData } from '../api/backend/notificationTypes'
import Calendar from '../components/basic/Calendar'
import DashboardWidgetSkeleton from '../components/dashboard/DashboardWidgetSkeleton'
import FullNotificationsSkeleton from '../components/notifications/FullNotificationsSkeleton'

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
  const [hasReceivedInitialData, setHasReceivedInitialData] = useState(
    initialData !== null
  )
  const backend = useBackend()

  useEffect(
    () =>
      backend?.subscribeToServiceData(data => {
        if (!data) return
        setHasReceivedInitialData(true)
        setState(data.notifications ?? null)
      }),
    [backend]
  )

  if (!hasReceivedInitialData) {
    return isWidget ? (
      <DashboardWidgetSkeleton type="notifications" />
    ) : (
      <FullNotificationsSkeleton />
    )
  }

  if (!state || state.active.length === 0) {
    if (isWidget) {
      return (
        <div className="flex h-full p-3">
          <Calendar />
        </div>
      )
    }
    return (
      <div className="content-reveal mt-20 text-center font-extrabold text-gray-400">
        <div className="mb-2">
          <CheckBoxOutlinedIcon className="!text-8xl" />
        </div>
        NO ACTIVE NOTIFICATIONS
        {state?.dndMode && <DndIsModeActive />}
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'mx-auto w-full max-w-[1000px] p-2',
        !isWidget && 'content-reveal'
      )}
    >
      {isWidget && (
        <div className="relative mb-4 text-3xl font-bold">
          {`${state.active.length} ACTIVE ${
            state.active.length > 1 ? 'NOTIFICATIONS' : 'NOTIFICATION'
          }`}
          <Link
            to="/notifications"
            className="press-feedback absolute right-0 top-0 flex h-full items-center rounded bg-gray-600 px-3 text-sm hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            OPEN FULL VIEW
          </Link>
        </div>
      )}
      {state.active.map(n => (
        <NotificationCard
          key={n.id}
          notification={n}
          onDismiss={() => backend?.dismissNotification(n.id)}
        />
      ))}
      {state.dndMode && <DndIsModeActive />}
    </div>
  )
}

export default Notifications
