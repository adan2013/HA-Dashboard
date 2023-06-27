import clsx from 'clsx'
import { cloneElement, ReactElement } from 'react'

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
  tileColor?: string
  iconClassnames?: string
  icon?: ReactElement
  size?: TileSize
  turnedOff?: boolean
  disabled?: boolean
  onClick?: () => void
  customBody?: ReactElement
}

const Tile = (propsTile: TileProps) => {
  const tile = {
    size: 'standard',
    ...propsTile
  }

  let backgroundColor = tile.tileColor || 'bg-blue-900'
  if (tile.disabled) {
    backgroundColor = 'bg-gray-600'
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
        <div className="absolute bottom-0 right-0 flex flex-row items-end px-3 py-2">
          <div className="text-6xl">{data.main}</div>
          {(data.decimal || data.unit) && (
            <div className="ml-1">
              <div className="text-right text-sm text-gray-300">
                {data.unit || ''}
              </div>
              <div className="text-2xl">{data.decimal || ''}</div>
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
        (tile.turnedOff || tile.disabled) && 'opacity-50',
        tile.onClick && !tile.disabled && 'cursor-pointer hover:border-white',
        backgroundColor
      )}
      onClick={tile.disabled ? undefined : tile.onClick}
    >
      <div className="px-3 py-2 text-lg">
        <div className="font-bold">{tile.title}</div>
        {tile.subtitle && <div className="font-light">{tile.subtitle}</div>}
      </div>
      {tile.metadata && (
        <div className="text-md absolute bottom-0 left-0 px-3 py-2 text-gray-200">
          {tile.metadata.map(meta => (
            <div key={meta}>{meta}</div>
          ))}
        </div>
      )}
      {renderValue()}
      {tile.icon &&
        cloneElement(tile.icon, {
          className: clsx(
            '!text-[5rem] absolute bottom-2 right-1',
            tile.iconClassnames
          )
        })}
      {tile.customBody}
    </div>
  )
}

export default Tile
