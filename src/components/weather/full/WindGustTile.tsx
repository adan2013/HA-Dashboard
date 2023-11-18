import Tile from '../../basic/Tile'
import RangeSegmentChart from '../../charts/RangeSegmentChart'

type Props = {
  value: number
}

const WindGustTile = ({ value }: Props) => (
  <Tile
    title="Wind gust"
    customBody={
      <RangeSegmentChart
        value={Math.round(value)}
        label="km/h"
        thresholds={[20, 40, 60, 80]}
      />
    }
  />
)

export default WindGustTile
