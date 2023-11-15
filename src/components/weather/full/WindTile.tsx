import Tile from '../../basic/Tile'
import RangeSegmentChart from '../../charts/RangeSegmentChart'
import BarHistoryChart from '../../charts/BarHistoryChart'

type Props = {
  windSpeed: number
  history: number[]
}

const WindTile = ({ windSpeed, history }: Props) => (
  <Tile
    title="Wind"
    size="horizontal"
    customBody={
      <div className="grid grid-cols-2">
        <RangeSegmentChart
          value={Math.round(windSpeed)}
          label="km/h"
          thresholds={[20, 40, 60, 80]}
        />
        <BarHistoryChart history={history} chartColor="#06b6d4" />
      </div>
    }
  />
)

export default WindTile
