import Tile from '../../basic/Tile'
import RangeSegmentChart from './RangeSegmentChart'

type UvIndexTileProps = {
  value: number
}

const getUvDescription = (uvi: number) => {
  switch (uvi) {
    case 0:
      return 'Low'
    case 1:
    case 2:
    case 3:
      return 'Moderate'
    case 4:
    case 5:
    case 6:
      return 'High'
    case 7:
    case 8:
    case 9:
      return 'Very high'
    default:
      return 'Extreme'
  }
}

const getActiveSegment = (uvi: number): number => {
  switch (uvi) {
    case 0:
    case 1:
    case 2:
      return 1
    case 3:
    case 4:
    case 5:
      return 2
    case 6:
    case 7:
      return 3
    case 8:
    case 9:
    case 10:
      return 4
    default:
      return 5
  }
}

const UvIndexTile = ({ value }: UvIndexTileProps) => {
  const uvi = Math.round(value)

  return (
    <Tile
      title="UV index"
      customBody={
        <RangeSegmentChart
          centerValue={uvi}
          bottomValue={getUvDescription(uvi)}
          activeSegment={getActiveSegment(uvi)}
        />
      }
    />
  )
}

export default UvIndexTile
