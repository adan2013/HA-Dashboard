import Tile from '../../basic/Tile'
import BarHistoryChart from '../../charts/BarHistoryChart'
import RangeSegmentChart from '../../charts/RangeSegmentChart'

const OPTIMAL_PRESSURE = 1013
const YELLOW_PRESSURE_THRESHOLD = 10
const ORANGE_PRESSURE_THRESHOLD = 20
const PRESSURE_THRESHOLDS: [number, number, number, number] = [
  OPTIMAL_PRESSURE - ORANGE_PRESSURE_THRESHOLD,
  OPTIMAL_PRESSURE - YELLOW_PRESSURE_THRESHOLD,
  OPTIMAL_PRESSURE + YELLOW_PRESSURE_THRESHOLD,
  OPTIMAL_PRESSURE + ORANGE_PRESSURE_THRESHOLD
]

type Props = {
  current: number
  history: number[]
}

const PressureTile = ({ current, history }: Props) => (
  <Tile
    title="Pressure"
    size="horizontal"
    customBody={
      <div className="grid grid-cols-2">
        <RangeSegmentChart
          value={current}
          label="hPa"
          thresholds={PRESSURE_THRESHOLDS}
          mode="range"
        />
        <BarHistoryChart
          history={history}
          chartColor="#f59e0b"
          minRangeOffset={10}
        />
      </div>
    }
  />
)

export default PressureTile
