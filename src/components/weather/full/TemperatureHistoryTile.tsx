import Tile from '../../basic/Tile'
import BarHistoryChart from '../../charts/BarHistoryChart'

type Props = {
  history: number[]
}

const TemperatureHistoryTile = ({ history }: Props) => (
  <Tile
    title="Temp. history"
    customBody={
      <BarHistoryChart
        history={history}
        chartColor="#b91c1c"
        minRangeOffset={1}
      />
    }
  />
)

export default TemperatureHistoryTile
