import Tile from '../../basic/Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useModalContext } from '../../../contexts/ModalContext'
import { RadiatorControlModalParams } from '../../../contexts/modalUtils'
import {
  formatRadiatorMode,
  formatTemperature,
  readRadiatorAction,
  readRadiatorMode,
  readTemperature
} from './radiatorUtils'

export type RadiatorTileProps = RadiatorControlModalParams

const RadiatorTile = ({
  title,
  entityId,
  batteryEntityId
}: RadiatorTileProps) => {
  const climate = useHomeAssistantEntity(entityId)
  const battery = useHomeAssistantEntity(batteryEntityId)
  const modal = useModalContext()
  const target = readTemperature(climate.entityState?.attributes?.temperature)
  const internalTemperature = climate.isUnavailable
    ? null
    : readTemperature(climate.entityState?.attributes?.current_temperature)
  const batteryLevel = battery.isUnavailable
    ? readTemperature(
        climate.entityState?.attributes?.battery_level ??
          climate.entityState?.attributes?.battery
      )
    : readTemperature(battery.entityState?.state)
  const [main, decimal] =
    target === null
      ? ['--', undefined]
      : [Math.floor(target), Math.round((target % 1) * 10)]

  return (
    <Tile
      title={title}
      subtitle={
        climate.isUnavailable
          ? '--'
          : `${formatRadiatorMode(
              readRadiatorMode(climate.entityState)
            )}, ${readRadiatorAction(climate.entityState)}`
      }
      metadata={[
        `SEN ${formatTemperature(internalTemperature)}`,
        `BAT ${batteryLevel === null ? '--' : `${Math.round(batteryLevel)}%`}`
      ]}
      value={{ main, decimal, unit: '°C' }}
      size="horizontal"
      isTurnedOff={climate.entityState?.state === 'off'}
      isUnavailable={climate.isUnavailable}
      isLoading={climate.isLoading || battery.isLoading}
      onClick={() =>
        modal.openModal('radiatorControl', {
          title,
          entityId,
          batteryEntityId
        })
      }
    />
  )
}

export default RadiatorTile
