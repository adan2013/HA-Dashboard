import Tile, { TileProps } from '../../Tile'
import { useHomeAssistantEntity } from '../../../ha/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'
import { LightType } from './lightTypes'
import { getIcon, getMetadata, getStatusSubtitle } from './lightUtils'

type LightTileProps = {
  title: string
  entityName: string
  lightType?: LightType
  disableToggle?: boolean
  allowManualControl?: boolean // TODO implement
  lockColorTemperature?: boolean // TODO implement
}

const LightTile = ({
  title,
  entityName,
  lightType,
  disableToggle,
  lockColorTemperature
}: LightTileProps) => {
  const haEntity = useHomeAssistantEntity(entityName)
  const ha = useHomeAssistant()

  const isUnavailable = !haEntity
  const isActive = haEntity?.state === 'on'

  const toggleLight = () => {
    if (isUnavailable) return
    const action = isActive ? 'turn_off' : 'turn_on'
    ha.callService(haEntity.id, 'light', action)
  }

  const tileData: TileProps = {
    title,
    subtitle: getStatusSubtitle(isUnavailable, isActive),
    icon: getIcon(lightType, isActive),
    isTurnedOff: !isActive,
    iconClassnames: isActive ? 'text-yellow-500' : undefined,
    metadata: getMetadata(isActive, lockColorTemperature, haEntity?.attributes),
    onClick: disableToggle ? undefined : toggleLight,
    isUnavailable
  }
  return <Tile {...tileData} />
}

LightTile.defaultProps = {
  lightType: 'bulb',
  disableToggle: false,
  allowManualControl: false,
  lockColorTemperature: false
}

export default LightTile
