import DashboardWidgetSkeleton from '../../dashboard/DashboardWidgetSkeleton'

const SkeletonTile = ({ wide = false }: { wide?: boolean }) => (
  <div
    className={`tile-skeleton relative overflow-hidden rounded-lg bg-neutral-800 ${
      wide ? 'col-span-2 aspect-[2/1]' : 'aspect-square'
    }`}
  />
)

const MobileWeatherSkeleton = () => (
  <div
    className="mx-auto flex w-full max-w-2xl flex-col gap-6"
    aria-label="Loading weather details"
    aria-busy="true"
    role="status"
    data-testid="mobile-weather-skeleton"
  >
    <div>
      <DashboardWidgetSkeleton type="weather" isDecorative />
    </div>

    <section aria-hidden="true">
      <div className="mb-3 h-6 w-40 rounded bg-neutral-800" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 10 }, (_, index) => (
          <SkeletonTile key={index} />
        ))}
        <SkeletonTile wide />
        <div className="tile-skeleton relative col-span-2 aspect-square overflow-hidden rounded-lg bg-neutral-800" />
      </div>
    </section>
  </div>
)

export default MobileWeatherSkeleton
