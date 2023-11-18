import Tile from '../../basic/Tile'

type Props = {
  value: number
}

const VisibilityTile = ({ value }: Props) => {
  const roundedValue = Math.round(value / 100) / 10
  const percentage = Math.round((roundedValue / 10) * 100)

  return (
    <Tile
      title="Visibility"
      value={{
        main: roundedValue,
        unit: 'km'
      }}
      metadata={[`${percentage}%`]}
    />
  )
}

export default VisibilityTile
