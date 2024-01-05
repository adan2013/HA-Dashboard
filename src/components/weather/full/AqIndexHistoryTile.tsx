import Tile from '../../basic/Tile'
import BarHistoryChart from '../../charts/BarHistoryChart'

type Props = {
  history: number[]
}

const AqIndexHistoryTile = ({ history }: Props) => (
  <Tile
    title="AQI history"
    customBody={
      <BarHistoryChart
        history={history}
        chartColor="#8b5cf6"
        minRangeOffset={1}
      />
    }
  />
)

export default AqIndexHistoryTile
