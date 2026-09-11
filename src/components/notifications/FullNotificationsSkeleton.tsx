const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`rounded bg-neutral-700 ${className}`} />
)

const FullNotificationsSkeleton = () => (
  <div
    className="tile-skeleton relative mx-auto w-full max-w-[1000px] overflow-hidden p-2"
    aria-label="Loading notification details"
    aria-busy="true"
    role="status"
  >
    {Array.from({ length: 4 }, (_, index) => (
      <div
        key={index}
        className="relative mb-6 border-l-8 border-neutral-700 bg-neutral-900 p-4"
      >
        <SkeletonBlock className="mb-4 h-5 w-2/5" />
        <SkeletonBlock className="mb-2 h-4 w-full" />
        <SkeletonBlock className="mb-2 h-4 w-4/5" />
        <SkeletonBlock className="mt-5 h-4 w-3/5" />
        <div className="mt-4 flex justify-end">
          <SkeletonBlock className="h-3 w-28" />
        </div>
      </div>
    ))}
  </div>
)

export default FullNotificationsSkeleton
