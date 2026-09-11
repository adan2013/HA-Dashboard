import clsx from 'clsx'

type TileSkeletonProps = {
  size?: 'standard' | 'horizontal' | 'big'
}

const TileSkeleton = ({ size = 'standard' }: TileSkeletonProps) => (
  <div
    className={clsx(
      'tile-skeleton relative overflow-hidden rounded-lg bg-neutral-800',
      size === 'standard' && 'aspect-square',
      size === 'horizontal' && 'col-span-2 aspect-[2/1]',
      size === 'big' && 'col-span-2 row-span-2 aspect-square'
    )}
  />
)

const ForecastTableSkeleton = ({ rows }: { rows: number }) => (
  <div className="tile-skeleton relative my-5 overflow-hidden rounded-lg bg-neutral-900">
    <div className="flex h-28 border-b border-neutral-700">
      <div className="w-48 shrink-0 bg-neutral-800" />
      {Array.from({ length: 7 }, (_, index) => (
        <div
          key={index}
          className="flex w-32 shrink-0 flex-col items-center justify-center gap-3 border-l border-neutral-800"
        >
          <div className="h-12 w-14 rounded-2xl bg-neutral-700" />
          <div className="h-4 w-16 rounded bg-neutral-700" />
        </div>
      ))}
    </div>
    {Array.from({ length: rows }, (_, rowIndex) => (
      <div
        key={rowIndex}
        className="flex h-8 border-b border-neutral-800 last:border-b-0"
      >
        <div className="flex w-48 shrink-0 items-center bg-neutral-800 px-4">
          <div className="h-3 w-28 rounded bg-neutral-700" />
        </div>
        {Array.from({ length: 7 }, (_, columnIndex) => (
          <div
            key={columnIndex}
            className="flex w-32 shrink-0 items-center justify-center border-l border-neutral-800"
          >
            <div className="h-3 w-10 rounded bg-neutral-700" />
          </div>
        ))}
      </div>
    ))}
  </div>
)

const FullWeatherSkeleton = () => (
  <div
    className="mx-auto w-full max-w-[1000px]"
    aria-label="Loading weather details"
    aria-busy="true"
    role="status"
  >
    <div className="mx-6">
      <div className="grid grid-cols-5 gap-4">
        <TileSkeleton size="horizontal" />
        <TileSkeleton />
        <TileSkeleton />
        <TileSkeleton />
        <TileSkeleton />
        <TileSkeleton size="horizontal" />
        <TileSkeleton size="big" />
        <TileSkeleton />
        <TileSkeleton />
        <TileSkeleton />
        <TileSkeleton size="horizontal" />
        <TileSkeleton />
        <TileSkeleton />
        <TileSkeleton />
      </div>
      <ForecastTableSkeleton rows={9} />
      <ForecastTableSkeleton rows={11} />
      <div className="mx-auto my-4 h-4 w-2/3 rounded bg-neutral-800" />
    </div>
  </div>
)

export default FullWeatherSkeleton
