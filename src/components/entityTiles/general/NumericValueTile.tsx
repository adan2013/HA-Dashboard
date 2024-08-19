import Tile, { TileProps, TileValue } from '../../basic/Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'

export const splitNumericValueToMainAndDecimal = (
  value: number,
  showDecimals: number
): [number, number] => {
  if (value === 0 || value === undefined) {
    return [0, 0]
  }
  const main = Math.floor(value)
  const decimalPart = value.toString().split('.')[1] || '00000'
  const decimal = decimalPart.substring(0, showDecimals)
  return [main, Number(decimal)]
}

export type NumericValueTileProps = {
  title: string
  entityId: string
  unit?: string
  showDecimals?: number
  customTileProps?: Partial<TileProps>
}

const NumericValueTile = ({
  title,
  entityId,
  unit,
  showDecimals = 0,
  customTileProps
}: NumericValueTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityId)

  const getValue = (): TileValue | string => {
    const value = Number.parseFloat(entityState?.state) || 0
    if (value === 0) {
      return {
        main: 0,
        decimal: showDecimals ? 0 : undefined,
        unit
      }
    }
    const [main, decimal] = splitNumericValueToMainAndDecimal(
      value,
      showDecimals
    )
    return {
      main,
      decimal: showDecimals ? decimal : undefined,
      unit
    }
  }

  const tileData: TileProps = {
    title,
    value: getValue(),
    isUnavailable,
    ...customTileProps
  }

  return <Tile {...tileData} />
}

export default NumericValueTile
