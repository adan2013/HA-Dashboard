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
    unit="%"
    historyGraphThresholds={[
      { label: 'Min', value: 40, color: 'green' },
      { label: 'Max', value: 60, color: 'red' }
    ]}
    {...customProps}
  />
)
