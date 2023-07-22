import ChartHistoryTile, {
  ChartHistoryTileProps
} from '../../charts/ChartHistoryTile'

type TypedPlugTileProps = {
  title: string
  entityName: string
  customProps?: Partial<ChartHistoryTileProps>
}

export const PowerChartTile = ({
  title,
  entityName,
  customProps
}: TypedPlugTileProps) => (
  <ChartHistoryTile
    title={title}
    entityName={entityName}
    unit="W"
    showDecimal
    {...customProps}
  />
)

export const EnergyConsumptionChartTile = ({
  title,
  entityName,
  customProps
}: TypedPlugTileProps) => (
  <ChartHistoryTile
    title={title}
    entityName={entityName}
    unit="kWh"
    showDecimal
    {...customProps}
  />
)
