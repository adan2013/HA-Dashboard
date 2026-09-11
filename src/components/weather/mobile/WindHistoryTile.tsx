import Tile from '../../basic/Tile'
import BarHistoryChart from '../../charts/BarHistoryChart'

type Props = {
  history: number[]
}

const WindHistoryTile = ({ history }: Props) => (
  <Tile
    title="Wind history"
    customBody={
      <BarHistoryChart
        history={history}
        chartColor="#06b6d4"
        minRangeOffset={1}
      />
    }
  />
)

export default WindHistoryTile
