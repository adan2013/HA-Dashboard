import Tile from '../../basic/Tile'
import RangeSegmentChart from '../../charts/RangeSegmentChart'

type AirQualityIndexTileProps = {
  value: number
}

const getAirQualityDescription = (aqi: number) => {
  switch (aqi) {
    case 1:
      return 'Good'
    case 2:
      return 'Fair'
    case 3:
      return 'Moderate'
    case 4:
      return 'Poor'
    default:
      return 'Hazardous'
  }
}

const AirQualityIndexTile = ({ value }: AirQualityIndexTileProps) => {
  const aqi = Math.round(value)

  return (
    <Tile
      title="Air quality index"
      customBody={
        <RangeSegmentChart
          value={aqi}
          label={getAirQualityDescription(aqi)}
          thresholds={[1, 2, 3, 4]}
        />
      }
    />
  )
}

export default AirQualityIndexTile
