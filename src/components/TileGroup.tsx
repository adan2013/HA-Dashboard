import { ReactNode } from 'react'
import { useLayoutContext } from '../contexts/OutletContext'

type TilesGroupProps = {
  name: string
  children: ReactNode
}

const TileGroup = ({ name, children }: TilesGroupProps) => {
  const layout = useLayoutContext()

  const extraStyles = layout?.isMobile
    ? {}
    : {
        gridTemplateRows: 'repeat(3, 150px)'
      }

  return (
    <div className="mb-10 flex flex-col justify-center lg:mb-0 lg:mr-10">
      <div className="text-ms my-2">{name}</div>
      <div
        className="inline-grid grid-flow-row-dense grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-flow-col-dense lg:grid-cols-none"
        style={extraStyles}
      >
        {children}
      </div>
    </div>
  )
}

export default TileGroup
