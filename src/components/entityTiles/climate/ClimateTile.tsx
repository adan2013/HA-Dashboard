import ChartHistoryTile, {
  ChartHistoryTileProps
} from '../../charts/ChartHistoryTile'

type TypedClimateTileProps = {
  title: string
  entityId: string
  customProps?: Partial<ChartHistoryTileProps>
}

export const TemperatureChartTile = ({
  title,
  entityId,
  customProps
}: TypedClimateTileProps) => (
  <ChartHistoryTile
    title={title}
    entityId={entityId}
    unit="°C"
    showDecimals={1}
    {...customProps}
  />
)

export const HumidityChartTile = ({
  title,
  entityId,
  customProps
}: TypedClimateTileProps) => (
  <ChartHistoryTile
    title={title}
    entityId={entityId}
    unit="%"
    historyGraphThresholds={[
      { label: 'Min', value: 40, color: 'green' },
      { label: 'Max', value: 60, color: 'red' }
    ]}
    {...customProps}
  />
)
