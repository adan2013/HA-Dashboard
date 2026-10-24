import { useState } from 'react'
import clsx from 'clsx'
import NotificationCard from '../components/notifications/NotificationCard'
import notificationExamples from '../components/notifications/notificationExamples'
import { NotificationPayload } from '../api/backend/notificationContract'

export const notificationLayoutExamples: NotificationPayload[] = [
  {
    ...notificationExamples.deadlineWarning,
    title:
      'Upcoming deadlines for household maintenance, recurring inspections and scheduled device servicing that need your attention this week',
    payload: {
      deadlines: [
        {
          label:
            'Replace the drinking water filter in the kitchen and reset its maintenance date after checking all connections for leaks.',
          daysLeft: 5
        },
        {
          label:
            'Check the sensor with a long identifier: kitchen_under_sink_water_leak_sensor_backup_battery_and_connection_status',
          daysLeft: -12
        }
      ]
    }
  },
  {
    ...notificationExamples.offlineSensor,
    title:
      'Disconnected_sensor_kitchen_under_sink_water_leak_detector_with_backup_battery_and_extended_connection_diagnostics',
    payload: {
      devices: [
        {
          name: 'kitchen_under_sink_water_leak_sensor_backup_battery_and_connection_status',
          reason: 'unavailable'
        }
      ]
    }
  }
]

const printerVariants: { label: string; notification: NotificationPayload }[] =
  [
    {
      label: 'Preparing · auto off disabled',
      notification: {
        ...notificationExamples['3dPrintStatus'],
        payload: {
          phase: 'preparing',
          progressPercentage: null,
          currentLayer: null,
          totalLayerCount: null,
          remainingMinutes: null,
          autoOffEnabled: false
        }
      }
    },
    {
      label: 'Printing · auto off disabled',
      notification: {
        ...notificationExamples['3dPrintStatus'],
        payload: {
          ...notificationExamples['3dPrintStatus'].payload,
          autoOffEnabled: false
        }
      }
    },
    {
      label: 'Finished · auto off disabled',
      notification: {
        ...notificationExamples['3dPrintFinished'],
        payload: { autoOffEnabled: false }
      }
    }
  ]

const Example = ({
  notification,
  label
}: {
  notification: NotificationPayload
  label: string
}) => (
  <div className="min-w-0" data-testid="notification-example">
    <div className="mb-2 text-xs text-gray-400 [overflow-wrap:anywhere]">
      {label}
    </div>
    <NotificationCard notification={notification} preview />
  </div>
)

const NotificationDiagnostics = () => {
  const [narrow, setNarrow] = useState(false)
  return (
    <div className="mx-auto max-w-[1000px] p-2 text-white">
      <div className="mb-6 rounded-xl bg-gray-900 p-4">
        <h1 className="text-2xl font-bold">Notification gallery</h1>
        <p className="mt-2 text-gray-300">
          All {Object.keys(notificationExamples).length} notification types.
          Titles and icons from the backend configuration; simulated payloads
          and timestamps. Actions and dismiss buttons are disabled in this
          preview.
        </p>
        <label
          htmlFor="narrow-notification-preview"
          className="min-h-11 mt-4 flex cursor-pointer items-center gap-3"
        >
          <input
            id="narrow-notification-preview"
            type="checkbox"
            checked={narrow}
            onChange={event => setNarrow(event.target.checked)}
            className="h-5 w-5 accent-blue-500"
          />
          Narrow preview (360 px)
        </label>
      </div>
      <div className={clsx('mx-auto w-full', narrow && 'max-w-[360px]')}>
        {Object.values(notificationExamples).map(notification => (
          <Example
            key={notification.id}
            notification={notification}
            label={notification.id}
          />
        ))}
        <h2 className="mb-4 text-xl font-bold">Additional printer states</h2>
        {printerVariants.map(({ notification, label }) => (
          <Example key={label} notification={notification} label={label} />
        ))}
        <h2 className="mb-2 text-xl font-bold">Text wrapping tests</h2>
        <p className="mb-4 text-gray-400">
          Synthetic long titles and payloads to check wrapping and clearance
          around the dismiss button.
        </p>
        {notificationLayoutExamples.map(notification => (
          <Example
            key={notification.id}
            notification={notification}
            label={`Layout test · ${notification.id}`}
          />
        ))}
      </div>
    </div>
  )
}

export default NotificationDiagnostics
