import Tile from '../../basic/Tile'
import RangeSegmentChart from './RangeSegmentChart'

type HumidityTileProps = {
  value: number
}

const getHumiditySegment = (humidity: number) => {
  if (humidity > 40 && humidity < 60) return 3
  if (humidity <= 40) return 2
  if (humidity >= 60) return 4
  if (humidity <= 5) return 1
  return 5
}

const HumidityTile = ({ value }: HumidityTileProps) => {
  const humidity = Math.round(value)

  return (
    <Tile
      title="Humidity"
      customBody={
        <RangeSegmentChart
          centerValue={humidity}
          bottomValue="%"
          mode="range"
          activeSegment={getHumiditySegment(humidity)}
        />
      }
    />
  )
}

export default HumidityTile
