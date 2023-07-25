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
    historyGraphThresholds={[
      { label: 'Power load limit', value: 2300, color: 'red' }
    ]}
    showDecimals={1}
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
    showDecimals={2}
    {...customProps}
  />
)
