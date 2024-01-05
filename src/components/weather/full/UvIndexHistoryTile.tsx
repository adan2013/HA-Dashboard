import Tile from '../../basic/Tile'
import BarHistoryChart from '../../charts/BarHistoryChart'

type Props = {
  history: number[]
}

const UvIndexHistoryTile = ({ history }: Props) => (
  <Tile
    title="UVI history"
    customBody={<BarHistoryChart history={history} chartColor="#fde047" />}
  />
)

export default UvIndexHistoryTile
