import Tile, { TileProps } from '../../basic/Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useBackend } from '../../../contexts/BackendContext'
import { LightType } from './lightTypes'
import {
  getIcon,
  getLightColor,
  getMetadata,
  getStatusSubtitle
} from './lightUtils'
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
  const { entityState, isUnavailable, isLoading } =
    useHomeAssistantEntity(entityId)
  const backend = useBackend()
  const modal = useModalContext()

  const isActive = entityState?.state === 'on'
  const lightColor = isActive
    ? getLightColor(entityState?.attributes)
    : undefined

  const toggleLight = () => {
    if (isUnavailable) return
    const action = isActive ? 'turn_off' : 'turn_on'
    backend.callService(entityState.id, 'light', action)
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
    icon: getIcon(lightType, isActive, lightColor),
    isTurnedOff: !isActive,
    iconClassnames: isActive && !lightColor ? 'text-yellow-500' : undefined,
    metadata: getMetadata(
      isActive,
      lockColorTemperature,
      entityState?.attributes
    ),
    onClick: disableToggle ? undefined : toggleLight,
    onHold: disableManualControl ? undefined : openModal,
    isUnavailable,
    isLoading
  }
  return <Tile {...tileData} />
}

LightTile.defaultProps = {
  lightType: 'bulb'
}

export default LightTile
