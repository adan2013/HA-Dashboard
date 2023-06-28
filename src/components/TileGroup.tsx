import { ReactNode } from 'react'

type TilesGroupProps = {
  name: string
  children: ReactNode
}

const TileGroup = ({ name, children }: TilesGroupProps) => (
  <div className="mb-10 lg:mb-0 lg:mr-10 lg:bg-red-600">
    <div className="my-2 text-lg">{name}</div>
    <div className="grid grid-flow-row-dense grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-none">
      {children}
    </div>
  </div>
)

export default TileGroup
