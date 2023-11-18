import Tile from '../../basic/Tile'
import RangeSegmentChart from '../../charts/RangeSegmentChart'

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

const UvIndexTile = ({ value }: UvIndexTileProps) => {
  const uvi = Math.round(value)

  return (
    <Tile
      title="UV index"
      customBody={
        <RangeSegmentChart
          value={uvi}
          label={getUvDescription(uvi)}
          thresholds={[2, 5, 7, 10]}
        />
      }
    />
  )
}

export default UvIndexTile
