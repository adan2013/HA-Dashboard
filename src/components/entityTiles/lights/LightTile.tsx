import Tile, { TileProps } from '../../basic/Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'
import { LightType } from './lightTypes'
import { getIcon, getMetadata, getStatusSubtitle } from './lightUtils'
import { useModalContext } from '../../../contexts/ModalContext'
import { LightControlModalParams } from '../../../contexts/modalUtils'

export type LightTileProps = {
  title: string
  entityId: string
  lightType?: LightType
  disableToggle?: boolean
  disableManualControl?: boolean
  lockColorTemperature?: boolean
}

const LightTile = ({
  title,
  entityId,
  lightType,
  disableToggle,
  disableManualControl,
  lockColorTemperature
}: LightTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityId)
  const ha = useHomeAssistant()
  const modal = useModalContext()

  const isActive = entityState?.state === 'on'

  const toggleLight = () => {
    if (isUnavailable) return
    const action = isActive ? 'turn_off' : 'turn_on'
    ha.callService(entityState.id, 'light', action)
  }

  const openModal = () => {
    modal.openModal('lightControl', {
      title,
      entityId,
      lockColorTemperature
    } as LightControlModalParams)
  }

  const tileData: TileProps = {
    title,
    subtitle: getStatusSubtitle(isUnavailable, isActive),
    icon: getIcon(lightType, isActive),
    isTurnedOff: !isActive,
    iconClassnames: isActive ? 'text-yellow-500' : undefined,
    metadata: getMetadata(
      isActive,
      lockColorTemperature,
      entityState?.attributes
    ),
    onClick: disableToggle ? undefined : toggleLight,
    onHold: disableManualControl ? undefined : openModal,
    isUnavailable
  }
  return <Tile {...tileData} />
}

LightTile.defaultProps = {
  lightType: 'bulb'
}

export default LightTile
