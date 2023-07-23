import { useEffect, useMemo, useState } from 'react'
import { getHistoryStats, NumberRange } from '../entityTiles/climate/utils'
import { useHomeAssistantEntity } from '../../api/hooks'
import BackgroundHistoryChart, { ChartData } from './BackgroundHistoryChart'
import HomeAssistantRestAPI from '../../api/HomeAssistantRestAPI'
import Tile, { TileProps, TileValue } from '../Tile'
import { useModalContext } from '../modals/ModalContext'
import { HistoryChartModalParams } from '../modals/utils'

export type ChartHistoryTileProps = {
  title: string
  entityName: string
  unit: string
  showDecimals?: number
  valueRange?: NumberRange
  hideMinMax?: boolean
  hideChart?: boolean
  customTileProps?: Partial<TileProps>
}

const ChartHistoryTile = ({
  title,
  entityName,
  unit,
  showDecimals,
  valueRange,
  hideMinMax,
  hideChart,
  customTileProps
}: ChartHistoryTileProps) => {
  const modal = useModalContext()
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityName)
  const [history, setHistory] = useState<ChartData[]>(null)

  const historyStats = useMemo(
    () => getHistoryStats(history, showDecimals),
    [history, showDecimals]
  )

  useEffect(() => {
    if (entityState?.id) {
      HomeAssistantRestAPI.getSensorHistory(entityState.id).then(data => {
        setHistory(data.map(item => ({ id: item.time, value: item.value })))
      })
    }
  }, [entityState])

  const openHistoryModal = () => {
    const params: HistoryChartModalParams = {
      title,
      entityName
    }
    modal.openModal('historyChart', params)
  }

  const getValue = (): TileValue | string => {
    const main = Math.floor(Number.parseFloat(entityState?.state)) || 0
    const decimal =
      (Number.parseFloat(entityState?.state) % 1)
        .toFixed(showDecimals)
        .substring(2) || 0
    return {
      main,
      decimal: showDecimals ? decimal : undefined,
      unit
    }
  }

  const chartMinValue = valueRange ? valueRange[0] : undefined
  const chartMaxValue = valueRange ? valueRange[1] : undefined

  const tileData: TileProps = {
    title,
    value: getValue(),
    size: 'horizontal',
    onClick: openHistoryModal,
    isUnavailable,
    ...customTileProps
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

ChartHistoryTile.defaultProps = {
  showDecimals: 0
}

export default ChartHistoryTile
