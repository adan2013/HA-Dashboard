import { useState, useEffect, useMemo } from 'react'
import Tile, { TileProps, TileValue } from '../../Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import BackgroundHistoryChart, { ChartData } from '../../charts/BackgroundHistoryChart'
import HomeAssistantRestAPI from '../../../api/HomeAssistantRestAPI'
import { getHistoryStats, NumberRange } from './utils'

type ChartHistoryTileProps = {
  title: string
  entityName: string
  unit: string
  showDecimal?: boolean
  valueRange?: NumberRange
  hideMinMax?: boolean
  hideChart?: boolean
}

const ChartHistoryTile = ({
  title,
  entityName,
  unit,
  showDecimal,
  valueRange,
  hideMinMax,
  hideChart
}: ChartHistoryTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityName)
  const [history, setHistory] = useState<ChartData[]>(null)

  const historyStats = useMemo(
    () => getHistoryStats(history, showDecimal ? 1 : 0),
    [history, showDecimal]
  )

  useEffect(() => {
    if (entityState?.id) {
      HomeAssistantRestAPI.getSensorHistory(entityState.id).then(data => {
        setHistory(data.map(item => ({ id: item.time, value: item.value })))
      })
    }
  }, [entityState])

  const getValue = (): TileValue | string => {
    const main = Math.floor(Number.parseFloat(entityState?.state)) || 0
    const decimal =
      Math.floor((Number.parseFloat(entityState?.state) % 1) * 10) || 0
    return {
      main,
      decimal: showDecimal ? decimal : undefined,
      unit
    }
  }

  const chartMinValue = valueRange ? valueRange[0] : null
  const chartMaxValue = valueRange ? valueRange[1] : null

  const tileData: TileProps = {
    title,
    value: getValue(),
    size: 'horizontal',
    isUnavailable
  }

  if (!hideChart && history) {
    tileData.customBody = (
      <BackgroundHistoryChart
        minValue={chartMinValue}
        maxValue={chartMaxValue}
        data={history}
      />
    )
  }

  if (!hideMinMax && historyStats) {
    tileData.metadata = [`${historyStats.min} / ${historyStats.max}`]
  }

  return <Tile {...tileData} />
}

export default ChartHistoryTile

type TypedChartHistoryTileProps = {
  title: string
  entityName: string
  customProps?: Partial<ChartHistoryTileProps>
}

export const TemperatureChartTile = ({
  title,
  entityName,
  customProps
}: TypedChartHistoryTileProps) => (
  <ChartHistoryTile
    title={title}
    entityName={entityName}
    valueRange={[22, 27]}
    unit="°C"
    showDecimal
    {...customProps}
  />
)

export const HumidityChartTile = ({
  title,
  entityName,
  customProps
}: TypedChartHistoryTileProps) => (
  <ChartHistoryTile
    title={title}
    entityName={entityName}
    valueRange={[30, 70]}
    unit="%"
    {...customProps}
  />
)
