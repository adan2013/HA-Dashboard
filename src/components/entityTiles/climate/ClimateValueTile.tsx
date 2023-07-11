import Tile, { TileProps, TileValue } from '../../Tile'
import { useHomeAssistantEntity } from '../../../ha/hooks'

type ClimateValueTileProps = {
  title: string
  entityName: string
  valueType: 'temperature' | 'humidity'
}

const ClimateValueTile = ({
  title,
  entityName,
  valueType
}: ClimateValueTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityName)

  const getValue = (): TileValue | string => {
    const main = Math.floor(Number.parseFloat(entityState?.state))
    const decimal = Math.round((Number.parseFloat(entityState?.state) % 1) * 10)
    switch (valueType) {
      case 'temperature':
        return {
          main,
          decimal,
          unit: '°C'
        }
      case 'humidity':
        return {
          main,
          unit: '%'
        }
      default:
        return '--'
    }
  }

  const tileData: TileProps = {
    title,
    value: getValue(),
    size: 'horizontal',
    isUnavailable
  }
  return <Tile {...tileData} />
}

ClimateValueTile.defaultProps = {}

export default ClimateValueTile
