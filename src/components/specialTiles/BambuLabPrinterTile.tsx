import { ReactElement, ReactNode } from 'react'
import SupportIcon from '@mui/icons-material/Support'
import LayersIcon from '@mui/icons-material/Layers'
import ScheduleIcon from '@mui/icons-material/Schedule'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import CycloneIcon from '@mui/icons-material/Cyclone'
import LineWeightIcon from '@mui/icons-material/LineWeight'
import SpeedIcon from '@mui/icons-material/Speed'
import Tile, { TileProps } from '../basic/Tile'
import {
  HomeAssistantEntityData,
  useHomeAssistantEntity
} from '../../api/hooks'

const readState = (entity: HomeAssistantEntityData): string | null => {
  if (entity.isUnavailable || entity.isLoading) return null
  const state = entity.entityState?.state
  if (typeof state !== 'string') return null
  const value = state.trim()
  if (!value || ['unknown', 'unavailable'].includes(value.toLowerCase())) {
    return null
  }
  return value
}

const readNumber = (
  entity: HomeAssistantEntityData,
  { integer = false, max = Infinity, min = 0 } = {}
): number | null => {
  const state = readState(entity)
  // Accept decimal sensor values only; Number('') and Number('0x10') are misleading.
  if (state === null || !/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(state)) return null
  const value = Number(state)
  if (
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (integer && !Number.isSafeInteger(value))
  ) {
    return null
  }
  return value
}

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

const transformRemainingTime = (time: number | null) => {
  if (time === null) return '--'
  const hours = Math.floor(time / 60)
  const minutes = Math.floor(time % 60)
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

  const printStatus = readState(printStatusEntity)
  const stage = transformStageValue(readState(stageEntity))
  const currentLayer = readNumber(currentLayerEntity, { integer: true }) ?? '--'
  const totalLayerCount =
    readNumber(totalLayerCountEntity, { integer: true }) ?? '--'
  const remainingTime = transformRemainingTime(readNumber(remainingTimeEntity))
  const speedProfile = readState(speedProfileEntity) ?? 'Unknown'
  const nozzleSizeValue = readNumber(nozzleSizeEntity)
  const nozzleSize =
    nozzleSizeValue !== null && nozzleSizeValue > 0
      ? `${nozzleSizeValue} mm`
      : '--'
  const nozzleTemp = readNumber(nozzleTempEntity) ?? '--'
  const nozzleTargetTemp = readNumber(nozzleTargetTempEntity) ?? '--'
  const bedTemp = readNumber(bedTempEntity) ?? '--'
  const bedTargetTemp = readNumber(bedTargetTempEntity) ?? '--'
  const auxFanSpeed = readNumber(auxFanEntity, { max: 100 }) ?? '--'
  const chamberFanSpeed = readNumber(chamberFanEntity, { max: 100 }) ?? '--'
  const partFanSpeed = readNumber(partFanEntity, { max: 100 }) ?? '--'
  const activeTray = readState(activeTrayEntity) ?? 'Unknown'

  const tileData: TileProps = {
    title,
    size: 'big',
    isUnavailable: printStatus === null,
    isLoading: [
      printStatusEntity,
      stageEntity,
      currentLayerEntity,
      totalLayerCountEntity,
      remainingTimeEntity,
      speedProfileEntity,
      nozzleSizeEntity,
      nozzleTempEntity,
      nozzleTargetTempEntity,
      bedTempEntity,
      bedTargetTempEntity,
      auxFanEntity,
      chamberFanEntity,
      partFanEntity,
      activeTrayEntity
    ].some(entity => entity.isLoading),
    customBody: (
      <div className="absolute bottom-0 left-0 h-72 w-full p-2">
        <div className="flex flex-col gap-4">
          <div className="mt-3">
            <div className="text-2xl font-bold">
              {printStatus === null ? 'Unavailable' : capitalize(printStatus)}
            </div>
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
