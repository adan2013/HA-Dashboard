import { useMemo } from 'react'
import Tile from '../../basic/Tile'
import BarHistoryChart from '../../charts/BarHistoryChart'
import RangeSegmentChart from '../../charts/RangeSegmentChart'

const YELLOW_PRESSURE_DIFF_THRESHOLD = 10
const ORANGE_PRESSURE_DIFF_THRESHOLD = 20
const PRESSURE_THRESHOLDS: [number, number, number, number] = [
  ORANGE_PRESSURE_DIFF_THRESHOLD * -1,
  YELLOW_PRESSURE_DIFF_THRESHOLD * -1,
  YELLOW_PRESSURE_DIFF_THRESHOLD,
  ORANGE_PRESSURE_DIFF_THRESHOLD
]

type Props = {
  current: number
  history: number[]
}

const PressureTile = ({ current, history }: Props) => {
  const diff = useMemo(() => {
    const min = Math.min(...history)
    const max = Math.max(...history)
    return max - min
  }, [history])

  return (
    <Tile
      title="Pressure"
      size="horizontal"
      customBody={
        <div className="grid grid-cols-2">
          <RangeSegmentChart
            value={diff}
            label="hPa"
            customCenterValue={current}
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
}

export default PressureTile
