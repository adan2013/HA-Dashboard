import { Section } from '../configs/configTypes'
import Tile from './Tile'

type TilesGroupProps = {
  config: Section
}

export default ({ config }: TilesGroupProps) => {
  return (
    <div className="flex flex-col">
      {config.groups.map(group => (
        <div key={group.name} className="mb-5">
          <div className="my-2 text-xl">{group.name}</div>
          <div className="grid grid-flow-row-dense grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4">
            {group.tiles.map(tile => (
              <Tile key={tile.name} tile={tile} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
