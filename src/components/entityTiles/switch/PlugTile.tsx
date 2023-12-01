import ChartHistoryTile, {
  ChartHistoryTileProps
} from '../../charts/ChartHistoryTile'

type TypedPlugTileProps = {
  title: string
  entityId: string
  customProps?: Partial<ChartHistoryTileProps>
}

export const PowerChartTile = ({
  title,
  entityId,
  customProps
}: TypedPlugTileProps) => (
  <ChartHistoryTile
    title={title}
    entityId={entityId}
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
  entityId,
  customProps
}: TypedPlugTileProps) => (
  <ChartHistoryTile
    title={title}
    entityId={entityId}
    unit="kWh"
    showDecimals={2}
    {...customProps}
  />
)
