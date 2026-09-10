import clsx from 'clsx'
import {
  cloneElement,
  forwardRef,
  ForwardedRef,
  ReactElement,
  useId,
  useLayoutEffect
} from 'react'
import PowerOffOutlinedIcon from '@mui/icons-material/PowerOffOutlined'
import useClickHoldLogic from '../../hooks/useClickHoldLogic'
import { useTileConnection } from '../../contexts/TileConnectionContext'

export type TileSize = 'standard' | 'horizontal' | 'big'

export type TileValue = {
  main: string | number
  decimal?: string | number
  unit?: string
}

export type TileProps = {
  title: string
  subtitle?: string
  metadata?: string[]
  value?: string | number | TileValue
  textColor?: string
  tileColor?: string
  iconClassnames?: string
  icon?: ReactElement
  size?: TileSize
  isTurnedOff?: boolean
  isUnavailable?: boolean
  isLoading?: boolean
  requiresHomeAssistant?: boolean
  onClick?: () => void
  onHold?: () => void
  customBody?: ReactElement
}

const Tile = (
  propsTile: TileProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLDivElement>
) => {
  const connection = useTileConnection()
  const tileId = useId()
  const { setTileLoading } = connection
  const { isUnavailable, requiresHomeAssistant } = propsTile
  const tile = {
    size: 'standard',
    ...propsTile,
    isUnavailable:
      isUnavailable ||
      (requiresHomeAssistant && connection.isHomeAssistantUnavailable)
  }
  // Report only this tile's data readiness; including the shared state would deadlock.
  // Layout effects keep ready tiles hidden before the browser paints the group.
  useLayoutEffect(() => {
    setTileLoading?.(tileId, Boolean(tile.isLoading))
    return () => setTileLoading?.(tileId, false)
  }, [setTileLoading, tileId, tile.isLoading])

  const isLoading = connection.isLoading || tile.isLoading
  const holdEvents = useClickHoldLogic(tile.onClick, tile.onHold, {
    disableInteractions: tile.isUnavailable || isLoading
  })
  const isInteractive = Boolean(tile.onClick || tile.onHold)
  const isDimmed = tile.isTurnedOff || tile.isUnavailable
  const dimmedContentClass = isDimmed && 'opacity-50'

  const textColor = tile.textColor || 'text-white'
  let backgroundColor = tile.tileColor || 'bg-blue-900'
  if (tile.isUnavailable) {
    backgroundColor = 'bg-blue-600'
  }

  const renderValue = () => {
    if (tile.value && !tile.icon) {
      const data: TileValue =
        typeof tile.value === 'object'
          ? (tile.value as TileValue)
          : {
              main: tile.value as string,
              decimal: '',
              unit: ''
            }
      return (
        <div
          className={clsx(
            'absolute bottom-0 right-0 z-10 flex flex-row items-end px-3 py-2',
            dimmedContentClass
          )}
        >
          <div className="text-5xl">{data.main}</div>
          {(data.decimal || data.unit) && (
            <div className="ml-1">
              <div className="text-right text-sm">{data.unit || ''}</div>
              {data.decimal !== undefined && (
                <div className="text-lg" data-testid="decimal-value">
                  .{data.decimal}
                </div>
              )}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const content = (
    <>
      <span
        aria-hidden="true"
        className={clsx(
          'pointer-events-none absolute -inset-0.5 z-0 rounded-lg',
          backgroundColor,
          isDimmed && 'opacity-50'
        )}
        data-testid="tile-background"
      />
      <div
        className="absolute left-0 top-0 z-20 w-full px-3 py-2 text-left text-base"
        data-testid="tile-header"
      >
        <div className={clsx('font-bold', isDimmed && 'text-gray-300')}>
          {tile.title}
        </div>
        {tile.subtitle && (
          <div className={clsx('text-sm font-light', dimmedContentClass)}>
            {tile.subtitle}
          </div>
        )}
      </div>
      {tile.metadata && !tile.isUnavailable && (
        <div
          className={clsx(
            'absolute bottom-0 left-0 z-10 px-3 py-2 text-xs text-gray-200',
            dimmedContentClass
          )}
        >
          {tile.metadata.map(meta => (
            <div key={meta}>{meta}</div>
          ))}
        </div>
      )}
      {tile.isUnavailable && (
        <div
          className={clsx(
            'absolute bottom-2 left-2 z-10 text-red-500',
            dimmedContentClass
          )}
          data-testid="unavailable-tile"
        >
          <PowerOffOutlinedIcon />
        </div>
      )}
      {renderValue()}
      {tile.icon &&
        cloneElement(tile.icon, {
          className: clsx(
            '!text-[4rem] absolute bottom-2 right-2 z-10',
            dimmedContentClass,
            tile.iconClassnames
          )
        })}
      {tile.customBody && (
        <fieldset
          disabled={tile.isUnavailable}
          className={clsx(
            'relative z-10 m-0 h-full min-w-0 border-0 p-0 pt-10',
            dimmedContentClass
          )}
          data-testid="tile-custom-body"
        >
          {tile.customBody}
        </fieldset>
      )}
    </>
  )

  const className = clsx(
    'relative block h-full w-full appearance-none rounded-lg border-2 border-transparent p-0 text-left font-inherit transition-colors duration-500',
    tile.size === 'standard' && 'aspect-square',
    tile.size === 'horizontal' && 'col-span-2 aspect-[2/1]',
    tile.size === 'big' && 'col-span-2 row-span-2 aspect-square',
    isInteractive &&
      !tile.isUnavailable &&
      !isLoading &&
      'press-feedback touch-manipulation select-none cursor-pointer hover:ring-2 hover:ring-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
    textColor
  )

  if (isLoading) {
    return (
      <div
        className={clsx(
          className,
          'tile-skeleton overflow-hidden bg-neutral-800'
        )}
        ref={ref as ForwardedRef<HTMLDivElement>}
        aria-label={`Loading ${tile.title}`}
        aria-busy="true"
        role="status"
      />
    )
  }

  if (!isInteractive) {
    return (
      <div
        className={className}
        ref={ref as ForwardedRef<HTMLDivElement>}
        data-testid="tile-bg"
      >
        {content}
      </div>
    )
  }

  return (
    <button
      type="button"
      aria-label={tile.title}
      className={clsx(className, tile.isUnavailable && 'cursor-not-allowed')}
      {...holdEvents}
      disabled={tile.isUnavailable}
      ref={ref as ForwardedRef<HTMLButtonElement>}
      data-testid="tile-bg"
    >
      {content}
    </button>
  )
}

export default forwardRef(Tile)
