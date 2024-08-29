import { ReactElement, ReactNode } from 'react'
import SupportIcon from '@mui/icons-material/Support'
import LayersIcon from '@mui/icons-material/Layers'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import CycloneIcon from '@mui/icons-material/Cyclone'
import LineWeightIcon from '@mui/icons-material/LineWeight'
import SpeedIcon from '@mui/icons-material/Speed'
import Tile, { TileProps } from '../basic/Tile'
import { useHomeAssistantEntity } from '../../api/hooks'

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const transformStageValue = (s: string) => {
  if (!s) return 'Unknown'
  const words = s.split('_')
  words[0] = capitalize(words[0])
  return words.join(' ')
}

type ParamProps = {
  icon: ReactElement
  children: ReactNode
}

const transformRemainingTime = (s: string) => {
  const time = Number(s)
  if (time <= 0) return '-- min'
  const hours = Math.floor(time / 60)
  const minutes = time % 60
  return `${hours}h ${minutes}m`
}

const Param = ({ icon, children }: ParamProps) => (
  <div className="flex flex-row gap-2">
    {icon}
    {children}
  </div>
)

type BambuLabPrinterTileProps = {
  title: string
  mainEntityId: string
}

const BambuLabPrinterTile = ({
  title,
  mainEntityId
}: BambuLabPrinterTileProps) => {
  const printStatusEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_print_status`
  )
  const stageEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_current_stage`
  )
  const currentLayerEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_current_layer`
  )
  const totalLayerCountEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_total_layer_count`
  )
  const remainingTimeEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_remaining_time`
  )
  const speedProfileEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_speed_profile`
  )
  const nozzleSizeEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_nozzle_size`
  )
  const nozzleTempEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_nozzle_temperature`
  )
  const nozzleTargetTempEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_nozzle_target_temperature`
  )
  const bedTempEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_bed_temperature`
  )
  const bedTargetTempEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_target_bed_temperature`
  )
  const auxFanEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_aux_fan_speed`
  )
  const chamberFanEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_chamber_fan_speed`
  )
  const partFanEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_cooling_fan_speed`
  )
  const activeTrayEntity = useHomeAssistantEntity(
    `sensor.${mainEntityId}_active_tray`
  )

  const printStatus = printStatusEntity.entityState?.state || 'Unknown'
  const stage = transformStageValue(stageEntity.entityState?.state)
  const currentLayer = Number(currentLayerEntity.entityState?.state) || '-'
  const totalLayerCount =
    Number(totalLayerCountEntity.entityState?.state) || '-'
  const remainingTime = transformRemainingTime(
    remainingTimeEntity.entityState?.state
  )
  const speedProfile = speedProfileEntity.entityState?.state || 'Unknown'
  const nozzleSize = nozzleSizeEntity.entityState?.state
    ? `${nozzleSizeEntity.entityState?.state} mm`
    : '--'
  const nozzleTemp = Number(nozzleTempEntity.entityState?.state) || '--'
  const nozzleTargetTemp =
    Number(nozzleTargetTempEntity.entityState?.state) || 0
  const bedTemp = Number(bedTempEntity.entityState?.state) || '--'
  const bedTargetTemp = Number(bedTargetTempEntity.entityState?.state) || 0
  const auxFanSpeed = Number(auxFanEntity.entityState?.state) || 0
  const chamberFanSpeed = Number(chamberFanEntity.entityState?.state) || 0
  const partFanSpeed = Number(partFanEntity.entityState?.state) || 0
  const activeTray = activeTrayEntity.isUnavailable
    ? 'Not selected'
    : activeTrayEntity.entityState?.state

  const tileData: TileProps = {
    title,
    size: 'big',
    customBody: (
      <div className="absolute bottom-0 left-0 h-72 w-full p-2">
        <div className="flex flex-col gap-4">
          <div className="mt-3">
            <div className="text-2xl font-bold">{capitalize(printStatus)}</div>
            <div className="text-xs">Stage: {stage}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Param
              icon={<LayersIcon />}
            >{`${currentLayer} / ${totalLayerCount}`}</Param>
            <Param icon={<ScheduleIcon />}>{remainingTime}</Param>
            <Param icon={<SpeedIcon />}>{capitalize(speedProfile)}</Param>
            <Param icon={<LineWeightIcon />}>{nozzleSize}</Param>
            <Param icon={<ThermostatIcon />}>
              <div className="flex flex-col gap-1">
                <div>
                  <div className="text-xs">Nozzle</div>
                  {`${nozzleTemp} → ${nozzleTargetTemp}°C`}
                </div>
                <div>
                  <div className="text-xs">Bed</div>
                  {`${bedTemp} → ${bedTargetTemp}°C`}
                </div>
              </div>
            </Param>
            <Param icon={<CycloneIcon />}>
              <div className="grid w-full grid-cols-2 gap-1">
                <div>Aux</div>
                <div>{`${auxFanSpeed}%`}</div>
                <div>Cham</div>
                <div>{`${chamberFanSpeed}%`}</div>
                <div>Part</div>
                <div>{`${partFanSpeed}%`}</div>
              </div>
            </Param>
          </div>
          <Param icon={<SupportIcon />}>{activeTray}</Param>
        </div>
      </div>
    )
  }
  return <Tile {...tileData} />
}

export default BambuLabPrinterTile
