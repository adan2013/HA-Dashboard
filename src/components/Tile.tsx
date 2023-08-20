import clsx from 'clsx'
import { cloneElement, forwardRef, MutableRefObject, ReactElement } from 'react'
import PowerOffOutlinedIcon from '@mui/icons-material/PowerOffOutlined'
import { useTheme } from '../contexts/GlobalContext'
import useClickHoldLogic from './useClickHoldLogic'

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
  onClick?: () => void
  onHold?: () => void
  customBody?: ReactElement
}

const Tile = (propsTile: TileProps, ref: MutableRefObject<HTMLDivElement>) => {
  const tile = {
    size: 'standard',
    ...propsTile
  }
  const theme = useTheme()
  const holdEvents = useClickHoldLogic(tile.onClick, tile.onHold, {
    disableInteractions: tile.isUnavailable
  })

  const textColor = tile.textColor || theme.text || 'text-white'
  let backgroundColor = tile.tileColor || theme.primary || 'bg-blue-900'
  if (tile.isUnavailable) {
    backgroundColor = theme.secondary || 'bg-gray-600'
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
        <div className="absolute bottom-0 right-0 z-10 flex flex-row items-end px-3 py-2">
          <div className="text-5xl">{data.main}</div>
          {(data.decimal || data.unit) && (
            <div className="ml-1">
              <div className="text-right text-sm">{data.unit || ''}</div>
              {data.decimal !== undefined && (
                <div className="text-lg">.{data.decimal}</div>
              )}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div
      className={clsx(
        'relative h-full w-full rounded-lg border-2 border-transparent transition-colors duration-500',
        tile.size === 'standard' && 'aspect-square',
        tile.size === 'horizontal' && 'col-span-2 aspect-[2/1]',
        tile.size === 'big' && 'col-span-2 row-span-2 aspect-square',
        (tile.isTurnedOff || tile.isUnavailable) && 'opacity-50',
        (tile.onClick || tile.onHold) &&
          !tile.isUnavailable &&
          'cursor-pointer hover:border-white',
        backgroundColor,
        textColor
      )}
      {...holdEvents}
      ref={ref}
    >
      <div className="text-md px-3 py-2">
        <div className="font-bold">{tile.title}</div>
        {tile.subtitle && (
          <div className="text-sm font-light">{tile.subtitle}</div>
        )}
      </div>
      {tile.metadata && !tile.isUnavailable && (
        <div className="absolute bottom-0 left-0 z-10 px-3 py-2 text-xs text-gray-200">
          {tile.metadata.map(meta => (
            <div key={meta}>{meta}</div>
          ))}
        </div>
      )}
      {tile.isUnavailable && (
        <div className="absolute bottom-2 left-2 text-red-500">
          <PowerOffOutlinedIcon />
        </div>
      )}
      {renderValue()}
      {tile.icon &&
        cloneElement(tile.icon, {
          className: clsx(
            '!text-[4rem] absolute bottom-2 right-2',
            tile.iconClassnames
          )
        })}
      {tile.customBody}
    </div>
  )
}

export default forwardRef(Tile)
