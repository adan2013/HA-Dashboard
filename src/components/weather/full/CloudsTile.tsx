import Tile from '../../basic/Tile'

type Props = {
  value: number
}

const CloudsTile = ({ value }: Props) => (
  <Tile
    title="Clouds"
    value={{
      main: Math.round(value),
      unit: '%'
    }}
  />
)

export default CloudsTile
