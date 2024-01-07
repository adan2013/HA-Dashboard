import ChartHistoryTile from '../../charts/ChartHistoryTile'

type TypedPlugTileProps = {
  title: string
  entityId: string
}

export const PowerChartTile = ({ title, entityId }: TypedPlugTileProps) => (
  <ChartHistoryTile
    title={title}
    entityId={entityId}
    unit="W"
    historyGraphThresholds={[
      { label: 'Power load limit', value: 2300, color: 'red' }
    ]}
    showDecimals={1}
  />
)

export const EnergyConsumptionChartTile = ({
  title,
  entityId
}: TypedPlugTileProps) => (
  <ChartHistoryTile
    title={title}
    entityId={entityId}
    unit="kWh"
    showDecimals={2}
    hideMinMax
    hideChart
    disableModalHistory
    customTileProps={{
      size: 'standard'
    }}
  />
)
