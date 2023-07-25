import clsx from 'clsx'
import Tile, { TileProps, TileSize } from '../../Tile'

type SceneOption = {
  msg: string
  name: string
  selected?: boolean
  extended?: boolean
}

type LightSceneSwitcherProps = {
  title: string
  options: SceneOption[]
}

type SwitcherProps = {
  options: SceneOption[]
  threeColumns: boolean
}

const Switcher = ({ options, threeColumns }: SwitcherProps) => (
  <div className="absolute bottom-0 left-0 w-full p-2">
    <div
      className={clsx(
        'grid gap-2',
        threeColumns ? 'grid-cols-3' : 'grid-cols-2'
      )}
    >
      {options.map(option => (
        <div
          key={option.name}
          className={clsx(
            'flex h-14 cursor-pointer items-center justify-center rounded-md border-2',
            'transition-colors hover:border-white hover:bg-white hover:text-black',
            option.selected
              ? 'border-white bg-white text-black'
              : 'border-gray-300 bg-transparent text-white',
            option.extended ? 'col-span-2' : 'col-span-1'
          )}
        >
          {option.name}
        </div>
      ))}
    </div>
  </div>
)

const LightSceneSwitcher = ({ title, options }: LightSceneSwitcherProps) => {
  const size: TileSize = options.length > 4 ? 'big' : 'horizontal'

  const tileData: TileProps = {
    title,
    size,
    customBody: (
      <Switcher options={options} threeColumns={size === 'horizontal'} />
    )
  }
  return <Tile {...tileData} />
}

export default LightSceneSwitcher
