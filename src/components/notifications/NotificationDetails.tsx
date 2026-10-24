import { ReactNode } from 'react'
import clsx from 'clsx'
import CircularProgress from '@mui/material/CircularProgress'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import {
  NotificationPayload,
  NotificationPayloadMap
} from '../../api/backend/notificationContract'

type DetailListProps = {
  title: string
  items: ReactNode[]
}

const DetailList = ({ title, items }: DetailListProps) => {
  if (!items.length) return null
  return (
    <section aria-label={title} className="mt-4 rounded-xl bg-gray-900/50 p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300">
        <span>{title}</span>
        <span className="ml-auto rounded-full bg-gray-700 px-2 py-0.5 text-xs text-white">
          {items.length}
        </span>
      </div>
      <ul className="list-disc space-y-2 pl-5 [overflow-wrap:anywhere] marker:text-blue-400">
        {items.map((item, index) => (
          // Different sensors may have the same display name.
          // eslint-disable-next-line react/no-array-index-key
          <li key={index} className="pl-1">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

const DetailTag = ({
  children,
  tone = 'neutral'
}: {
  children: ReactNode
  tone?: 'neutral' | 'warning' | 'danger'
}) => (
  <span
    className={clsx(
      'inline-block whitespace-nowrap rounded px-2 py-0.5 align-middle text-xs font-medium tabular-nums',
      {
        'bg-gray-700 text-gray-200': tone === 'neutral',
        'bg-amber-400/10 text-amber-300': tone === 'warning',
        'bg-red-400/10 text-red-300': tone === 'danger'
      }
    )}
  >
    {children}
  </span>
)

const DeadlineTag = ({ daysLeft }: { daysLeft: number }) => {
  const days = Math.abs(daysLeft)
  const unit = days === 1 ? 'day' : 'days'
  const label =
    daysLeft === 0
      ? 'Due today'
      : `${days} ${unit} ${daysLeft < 0 ? 'overdue' : 'left'}`
  let tone: 'neutral' | 'warning' | 'danger' = 'neutral'
  if (daysLeft === 0) tone = 'warning'
  if (daysLeft < 0) tone = 'danger'
  return <DetailTag tone={tone}>{label}</DetailTag>
}

const formatReportAge = (hours: number) => {
  const days = Math.floor(hours / 24)
  const rest = hours % 24
  if (!days) return `${hours}h without report`
  return `${days}d${rest ? ` ${rest}h` : ''} without report`
}

const AutoOffStatus = () => (
  <div className="flex items-center gap-2 text-sm text-gray-300">
    <PowerSettingsNewIcon className="text-green-500" />
    <span>Auto off enabled</span>
  </div>
)

const formatRemainingTime = (minutes: number | null) => {
  if (minutes === null || minutes <= 0) return 'Estimating…'
  const rounded = Math.ceil(minutes)
  const hours = Math.floor(rounded / 60)
  const rest = rounded % 60
  return hours ? `${hours}h ${rest}m` : `${rest}m`
}

const PrintDetails = ({
  payload
}: {
  payload: NotificationPayloadMap['3dPrintStatus']
}) => {
  const progress = payload.progressPercentage
  return (
    <section
      aria-label="Print progress"
      className="mt-4 flex flex-wrap items-center gap-4 rounded-xl bg-gray-900/50 p-4"
    >
      <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
        <CircularProgress
          variant="determinate"
          value={100}
          size={80}
          thickness={4}
          className="!absolute !text-gray-700"
          aria-hidden="true"
        />
        {progress !== null && (
          <CircularProgress
            variant="determinate"
            value={progress}
            size={80}
            thickness={4}
            className="!absolute !text-blue-400"
            aria-label="Print completion"
          />
        )}
        <span className="text-lg font-bold tabular-nums">
          {progress === null ? '—' : `${Math.round(progress)}%`}
        </span>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <div className="font-semibold">
          {payload.phase === 'preparing' ? 'Preparing to print…' : 'Printing'}
        </div>
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-gray-400">Layer</dt>
            <dd className="font-semibold tabular-nums">
              {payload.currentLayer ?? '—'} / {payload.totalLayerCount ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-gray-400">Time remaining</dt>
            <dd className="font-semibold tabular-nums">
              {formatRemainingTime(payload.remainingMinutes)}
            </dd>
          </div>
        </dl>
        {payload.autoOffEnabled && <AutoOffStatus />}
      </div>
    </section>
  )
}

const NotificationDetails = ({
  notification
}: {
  notification: NotificationPayload
}) => {
  switch (notification.id) {
    case 'deadlineWarning':
      return notification.payload ? (
        <DetailList
          title="Detected deadlines"
          items={notification.payload.deadlines.map(deadline =>
            // Older backend versions send labels without day counts.
            typeof deadline === 'string' ? (
              deadline
            ) : (
              <>
                {deadline.label} <DeadlineTag daysLeft={deadline.daysLeft} />
              </>
            )
          )}
        />
      ) : null
    case 'lowBattery':
      return notification.payload ? (
        <DetailList
          title="Affected devices"
          items={notification.payload.devices.map(device =>
            typeof device === 'string' ? (
              device
            ) : (
              <>
                {device.name}{' '}
                {device.batteryPercentage !== null &&
                  Number.isFinite(device.batteryPercentage) &&
                  device.batteryPercentage >= 0 &&
                  device.batteryPercentage <= 100 && (
                    <DetailTag
                      tone={
                        device.batteryPercentage <= 10 ? 'danger' : 'warning'
                      }
                    >
                      {device.batteryPercentage}%
                    </DetailTag>
                  )}
              </>
            )
          )}
        />
      ) : null
    case 'offlineSensor':
      return notification.payload ? (
        <DetailList
          title="Affected devices"
          items={notification.payload.devices.map(device =>
            typeof device === 'string' ? (
              device
            ) : (
              <>
                {device.name}{' '}
                <DetailTag tone="danger">
                  {
                    {
                      pingFailed: 'No ping response',
                      unavailable: 'Unavailable',
                      unknown: 'Unknown state'
                    }[device.reason]
                  }
                </DetailTag>
              </>
            )
          )}
        />
      ) : null
    case 'noSensorUpdate':
      return notification.payload ? (
        <DetailList
          title="Affected devices"
          items={notification.payload.devices.map(device =>
            typeof device === 'string' ? (
              device
            ) : (
              <>
                {device.name}{' '}
                {device.hoursSinceLastReport !== null &&
                  Number.isFinite(device.hoursSinceLastReport) &&
                  device.hoursSinceLastReport >= 0 && (
                    <DetailTag tone="warning">
                      {formatReportAge(device.hoursSinceLastReport)}
                    </DetailTag>
                  )}
              </>
            )
          )}
        />
      ) : null
    case 'waterLeak':
      return notification.payload ? (
        <DetailList
          title="Triggered sensors"
          items={notification.payload.sensors}
        />
      ) : null
    case 'broadcastDeviceCamera':
      return notification.payload ? (
        <DetailList
          title="Active devices"
          items={notification.payload.devices}
        />
      ) : null
    case 'broadcastDeviceMicrophone':
      return notification.payload ? (
        <DetailList
          title="Active devices"
          items={notification.payload.devices}
        />
      ) : null
    case '3dPrintStatus':
      return notification.payload ? (
        <PrintDetails payload={notification.payload} />
      ) : null
    case '3dPrintFinished':
      return notification.payload?.autoOffEnabled ? (
        <div className="mt-4">
          <AutoOffStatus />
        </div>
      ) : null
    case 'smsFailure':
      return notification.payload ? (
        <section
          aria-label="SMS delivery failure"
          className="mt-4 rounded-xl border border-red-400/30 bg-red-950/30 p-4"
        >
          <div className="mb-2 text-sm font-semibold text-red-200">
            Delivery details
          </div>
          <dl className="space-y-2 text-sm [overflow-wrap:anywhere]">
            <div>
              <dt className="text-gray-400">Alert source</dt>
              <dd>
                {{
                  waterLeak: 'Water leak',
                  mainDoorOpen: 'Main door',
                  test: 'Manual test'
                }[notification.payload.source] ?? notification.payload.source}
              </dd>
            </div>
            {notification.payload.delivery && (
              <div>
                <dt className="text-gray-400">Accepted by provider</dt>
                <dd className="font-semibold tabular-nums">
                  {notification.payload.delivery.sent} /{' '}
                  {notification.payload.delivery.total}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-gray-400">Failure reasons</dt>
              <dd>
                <ul className="mt-1 list-disc space-y-1 pl-5 marker:text-red-300">
                  {notification.payload.errors.map(error => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </section>
      ) : null
    default:
      return null
  }
}

export default NotificationDetails
