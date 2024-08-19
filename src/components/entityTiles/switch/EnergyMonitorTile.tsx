import { useEffect, useState } from 'react'
import Tile, { TileProps } from '../../basic/Tile'
import { useBackend } from '../../../contexts/BackendContext'
import { DeviceStatistics } from '../../../api/backend/energyMonitorTypes'

type MonitorValueProps = {
  title: string
  value?: number
}

const MonitorValue = ({ title, value }: MonitorValueProps) => (
  <div className="flex-center h-24 flex-1 text-center">
    <div>
      <div className="text-2xl">
        <span data-testid={`${title}-value`}>
          {value === undefined ? '-' : value.toFixed(2)}
        </span>
      </div>
      <div className="text-xs text-gray-300">{title}</div>
    </div>
  </div>
)

export type EnergyMonitorTileProps = {
  deviceName: string
  title: string
}

const EnergyMonitorTile = ({ deviceName, title }: EnergyMonitorTileProps) => {
  const [monitorState, setMonitorState] = useState<DeviceStatistics>()
  const backend = useBackend()

  useEffect(
    () =>
      backend?.subscribeToServiceData(data => {
        if (data?.energyMonitor) {
          const monitor = data.energyMonitor.monitors?.find(
            ds => ds.deviceName === deviceName
          )
          setMonitorState(monitor)
        }
      }),
    [backend, deviceName]
  )

  const tileBody = (
    <div className="absolute bottom-0 left-0 flex h-24 w-full flex-row overflow-hidden rounded-b-md">
      <MonitorValue
        title="Runtime"
        value={monitorState?.consumedEnergy.runtime}
      />
      <MonitorValue title="Daily" value={monitorState?.consumedEnergy.daily} />
      <MonitorValue
        title="Monthly"
        value={monitorState?.consumedEnergy.monthly}
      />
    </div>
  )

  const tileData: TileProps = {
    title: `${title} [kWh]`,
    customBody: tileBody,
    size: 'horizontal'
  }
  return <Tile {...tileData} />
}

export default EnergyMonitorTile
