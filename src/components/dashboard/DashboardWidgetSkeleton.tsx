import clsx from 'clsx'

type DashboardWidgetSkeletonProps = {
  type: 'weather' | 'notifications'
}

const SkeletonBlock = ({
  className,
  onSurface = false
}: {
  className: string
  onSurface?: boolean
}) => (
  <div
    className={clsx(
      'rounded-md',
      onSurface ? 'bg-gray-700' : 'bg-neutral-800',
      className
    )}
  />
)

const WeatherSkeleton = () => (
  <div className="flex h-full flex-col gap-2">
    <div className="flex shrink-0 flex-row items-center gap-3 overflow-hidden">
      <SkeletonBlock className="h-[100px] min-w-[100px] rounded-2xl" />
      <div className="mr-6 flex min-w-[100px] flex-col items-start gap-3">
        <SkeletonBlock className="h-12 w-24" />
        <SkeletonBlock className="h-5 w-28" />
      </div>
      <div className="flex flex-1 flex-row justify-end gap-2">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex w-20 shrink-0 flex-col items-center gap-2"
          >
            <SkeletonBlock className="h-8 w-8 rounded-full" />
            <SkeletonBlock className="h-5 w-16" />
            <SkeletonBlock className="h-2 w-full rounded-none" />
          </div>
        ))}
      </div>
    </div>
    <div className="mx-1 shrink-0 border-b border-gray-400" />
    <div className="flex shrink-0 flex-row gap-2 overflow-hidden py-1">
      {Array.from({ length: 12 }, (_, index) => (
        <div
          key={index}
          className="flex min-w-[7rem] flex-col items-center gap-1 rounded bg-gray-800 py-2"
        >
          <SkeletonBlock className="h-5 w-9" onSurface />
          <div className="flex h-16 w-28 items-center justify-center">
            <SkeletonBlock className="h-12 w-14 rounded-2xl" onSurface />
          </div>
          <SkeletonBlock className="h-5 w-16" onSurface />
          <SkeletonBlock className="mt-1 h-6 w-6 rounded-full" onSurface />
        </div>
      ))}
    </div>
    <div className="mx-1 shrink-0 border-b border-gray-400" />
    <div className="m-1 flex flex-1 flex-col gap-2">
      {Array.from({ length: 3 }, (_, index) => (
        <div
          key={index}
          className="flex min-h-[58px] items-center justify-between rounded bg-gray-800 px-3 py-2"
        >
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-5 w-20" onSurface />
            <SkeletonBlock className="h-10 w-12 rounded-2xl" onSurface />
            <SkeletonBlock className="h-5 w-24" onSurface />
          </div>
          <div className="flex flex-1 items-center justify-center gap-4">
            <SkeletonBlock className="h-5 w-20" onSurface />
            <SkeletonBlock className="h-5 w-28" onSurface />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const NotificationsSkeleton = () => (
  <div className="flex h-full flex-col gap-5 p-2">
    <SkeletonBlock className="h-9 w-64 max-w-full" />
    {Array.from({ length: 3 }, (_, index) => (
      <div
        key={index}
        className="border-l-8 border-neutral-700 bg-neutral-900 p-4"
      >
        <SkeletonBlock className="mb-4 h-5 w-2/5" />
        <SkeletonBlock className="mb-2 h-4 w-full" />
        <SkeletonBlock className="h-4 w-4/5" />
      </div>
    ))}
  </div>
)

const DashboardWidgetSkeleton = ({ type }: DashboardWidgetSkeletonProps) => (
  <div
    className="tile-skeleton relative h-full min-h-80 overflow-hidden"
    aria-label={`Loading ${type}`}
    aria-busy="true"
    role="status"
  >
    {type === 'weather' ? <WeatherSkeleton /> : <NotificationsSkeleton />}
  </div>
)

export default DashboardWidgetSkeleton
