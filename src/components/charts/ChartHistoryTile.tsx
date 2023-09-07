import { useEffect, useMemo, useState } from 'react'
import { useHomeAssistantEntity } from '../../api/hooks'
import BackgroundHistoryChart from './BackgroundHistoryChart'
import HomeAssistantRestAPI from '../../api/HomeAssistantRestAPI'
import Tile, { TileProps, TileValue } from '../basic/Tile'
import { useModalContext } from '../../contexts/ModalContext'
import { HistoryChartModalParams } from '../../contexts/modalUtils'
import { ChartData, getHistoryStats, ValueThreshold } from './utils'

export type ChartHistoryTileProps = {
  title: string
  entityName: string
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
  entityName,
  unit,
  showDecimals,
  hideMinMax,
  hideChart,
  disableModalHistory,
  historyGraphThresholds,
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
        setHistory(
          data.map(item => ({
            id: item.time,
            name: item.time,
            value: item.value
          }))
        )
      })
    }
  }, [entityState])

  const openHistoryModal = () => {
    const params: HistoryChartModalParams = {
      title,
      entityName,
      entityId: entityState?.id,
      graphValueThresholds: historyGraphThresholds
    }
    modal.openModal('historyChart', params)
  }

  const getValue = (): TileValue | string => {
    const value = Number.parseFloat(entityState?.state) || 0
    if (value === 0) {
      return {
        main: 0,
        decimal: showDecimals ? 0 : undefined,
        unit
      }
    }
    const main = Math.floor(value)
    const decimalPart = value.toString().split('.')[1] || '00000'
    const decimal = decimalPart.substring(0, showDecimals)
    return {
      main,
      decimal: showDecimals ? decimal : undefined,
      unit
    }
  }

  const tileData: TileProps = {
    title,
    value: getValue(),
    size: 'horizontal',
    onClick: disableModalHistory ? undefined : openHistoryModal,
    isUnavailable,
    ...customTileProps
  }

  if (!hideChart && history) {
    tileData.customBody = <BackgroundHistoryChart data={history} />
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
