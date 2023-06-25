import { Tile } from '../configs/configTypes'
import clsx from 'clsx'

type TileProps = {
  tile: Tile
}

export default (props: TileProps) => {
  const tile = {
    size: 'standard',
    ...props.tile
  }
  return (
    <div
      key={tile.name}
      className={clsx(
        'relative h-full w-full rounded-lg bg-gray-500',
        tile.size === 'standard' && 'aspect-square',
        tile.size === 'horizontal' && 'col-span-2 aspect-[2/1]',
        tile.size === 'big' && 'col-span-2 row-span-2 aspect-square'
      )}
    >
      <div className="absolute bottom-0 left-0 px-3 py-2">{tile.name}</div>
    </div>
  )
}
