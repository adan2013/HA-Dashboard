import CloseIcon from '@mui/icons-material/Close'
import clsx from 'clsx'
import {
  NotificationLight,
  NotificationPayload
} from '../../api/backend/notificationTypes'
import { addLeadingZero } from '../../utils/numberUtils'
import NotificationDetails from './NotificationDetails'
import NotificationActionButton from './NotificationActionButton'
import NotificationIcon from './NotificationIcon'

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

type NotificationCardProps = {
  notification: NotificationPayload
  onDismiss?: () => void
  preview?: boolean
}

const NotificationCard = ({
  notification: n,
  onDismiss,
  preview = false
}: NotificationCardProps) => (
  <article
    aria-label={n.title}
    data-testid={`notification-light-border-${n.id}`}
    className={clsx(
      'mb-6 min-w-0 border-l-8 bg-gray-800 p-4',
      getBorderColor(n.light)
    )}
  >
    <div className="flex items-start gap-3">
      <h2 className="flex min-w-0 flex-1 items-start gap-3 text-lg font-bold leading-7">
        <span className="flex h-7 shrink-0 items-center">
          <NotificationIcon name={n.icon} />
        </span>
        <span
          className="min-w-0 [overflow-wrap:anywhere]"
          data-testid={`notification-title-${n.id}`}
        >
          {n.title}
        </span>
      </h2>
      {n.canBeDismissed && (
        <button
          type="button"
          aria-label={`Dismiss ${n.title}`}
          disabled={preview}
          onClick={onDismiss}
          data-testid={`notification-close-button-${n.id}`}
          className="press-feedback -mr-2 -mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-default"
        >
          <CloseIcon className="!text-3xl" />
        </button>
      )}
    </div>
    <NotificationDetails notification={n} />
    <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-3">
      <NotificationActionButton id={n.id} preview={preview} />
      <time
        dateTime={n.createdAt}
        className="ml-auto shrink-0 whitespace-nowrap text-right text-sm font-light text-gray-200"
      >
        {formatTime(n.createdAt)}
      </time>
    </div>
  </article>
)

export default NotificationCard
