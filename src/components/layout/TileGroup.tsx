import { ReactNode, useRef, useEffect, useState } from 'react'
import { useLayoutContext } from '../../contexts/OutletContext'

type TilesGroupProps = {
  name?: string
  children: ReactNode
}

const DEFAULT_ROW_COUNT = 3
const HEADER_HEIGHT = 30
const TILE_SIZE_WITH_GAP = 175
const MIN_ROW_COUNT = 2

const TileGroup = ({ name, children }: TilesGroupProps) => {
  const layout = useLayoutContext()
  const containerRef = useRef(null)
  const [rowCount, setRowCount] = useState<number>(DEFAULT_ROW_COUNT)

  useEffect(() => {
    const onResize = () => {
      const h = containerRef?.current?.clientHeight || 0
      setRowCount(
        Math.max(
          Math.floor((h - HEADER_HEIGHT) / TILE_SIZE_WITH_GAP),
          MIN_ROW_COUNT
        )
      )
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const extraStyles = layout?.isMobile
    ? {}
    : {
        gridTemplateRows: `repeat(${rowCount}, 150px)`
      }

  return (
    <div className="flex flex-col justify-center" ref={containerRef}>
      {name && <div className="mb-2 text-lg">{name}</div>}
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
