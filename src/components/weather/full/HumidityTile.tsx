import Tile from '../../basic/Tile'
import RangeSegmentChart from '../../charts/RangeSegmentChart'

type HumidityTileProps = {
  value: number
}

const HumidityTile = ({ value }: HumidityTileProps) => {
  const humidity = Math.round(value)

  return (
    <Tile
      title="Humidity"
      customBody={
        <RangeSegmentChart
          value={humidity}
          label="%"
          mode="range"
          thresholds={[20, 40, 60, 80]}
        />
      }
    />
  )
}

export default HumidityTile
