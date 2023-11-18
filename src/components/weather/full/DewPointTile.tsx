import Tile from '../../basic/Tile'

type Props = {
  value: number
}

const DewPointTile = ({ value }: Props) => (
  <Tile title="Dew point" value={`${Math.round(value)}°`} />
)

export default DewPointTile
