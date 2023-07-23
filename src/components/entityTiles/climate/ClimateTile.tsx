import ChartHistoryTile, {
  ChartHistoryTileProps
} from '../../charts/ChartHistoryTile'

type TypedClimateTileProps = {
  title: string
  entityName: string
  customProps?: Partial<ChartHistoryTileProps>
}

export const TemperatureChartTile = ({
  title,
  entityName,
  customProps
}: TypedClimateTileProps) => (
  <ChartHistoryTile
    title={title}
    entityName={entityName}
    valueRange={[22, 27]}
    unit="°C"
    showDecimals={1}
    {...customProps}
  />
)

export const HumidityChartTile = ({
  title,
  entityName,
  customProps
}: TypedClimateTileProps) => (
  <ChartHistoryTile
    title={title}
    entityName={entityName}
    valueRange={[30, 70]}
    unit="%"
    {...customProps}
  />
)
