import { useEffect, useMemo, useState } from 'react'
import BackgroundHistoryChart from './BackgroundHistoryChart'
import HomeAssistantRestAPI from '../../api/HomeAssistantRestAPI'
import { TileProps } from '../basic/Tile'
import { useModalContext } from '../../contexts/ModalContext'
import { HistoryChartModalParams } from '../../contexts/modalUtils'
import { ChartData, getHistoryStats, ValueThreshold } from './utils'
import NumericValueTile, {
  NumericValueTileProps
} from '../entityTiles/general/NumericValueTile'

export type ChartHistoryTileProps = {
  title: string
  entityId: string
  unit: string
  showDecimals?: number
  hideMinMax?: boolean
  hideChart?: boolean
  disableModalHistory?: boolean
  historyGraphThresholds?: ValueThreshold[]
  customTileProps?: Partial<TileProps>
}

const ChartHistoryTile = ({
  title,
  entityId,
  unit,
  showDecimals = 0,
  hideMinMax,
  hideChart,
  disableModalHistory,
  historyGraphThresholds,
  customTileProps
}: ChartHistoryTileProps) => {
  const [history, setHistory] = useState<ChartData[]>(null)
  const modal = useModalContext()

  const historyStats = useMemo(
    () => getHistoryStats(history, showDecimals),
    [history, showDecimals]
  )

  useEffect(() => {
    HomeAssistantRestAPI.getSensorHistory(entityId).then(data => {
      setHistory(
        data.map(item => ({
          id: item.time,
          name: item.time,
          value: item.value
        }))
      )
    })
  }, [entityId])

  const openHistoryModal = () => {
    const params: HistoryChartModalParams = {
      title,
      entityId,
      graphValueThresholds: historyGraphThresholds
    }
    modal.openModal('historyChart', params)
  }

  const numericTileData: NumericValueTileProps = {
    title,
    entityId,
    unit,
    showDecimals,
    customTileProps: {
      size: 'horizontal',
      onClick: disableModalHistory ? undefined : openHistoryModal,
      customBody:
        !hideChart && history ? (
          <BackgroundHistoryChart data={history} />
        ) : undefined,
      metadata:
        !hideMinMax && historyStats
          ? [`${historyStats.min} / ${historyStats.max}`]
          : undefined,
      ...customTileProps
    }
  }

  return <NumericValueTile {...numericTileData} />
}

export default ChartHistoryTile
