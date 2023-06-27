import { ReactNode } from 'react'

type TilesGroupProps = {
  name: string
  children: ReactNode
}

const TileGroup = ({ name, children }: TilesGroupProps) => (
  <div className="flex flex-col">

    <div className="mb-5">
      <div className="my-2 text-xl">{name}</div>
      <div className="grid grid-flow-row-dense grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
        {children}
      </div>
    </div>

  </div>
)

export default TileGroup
