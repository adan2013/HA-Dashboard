import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LightOutlinedIcon from '@mui/icons-material/LightOutlined'
import LightIcon from '@mui/icons-material/Light'
import Tile, { TileProps } from '../Tile'
import { useHomeAssistantEntity } from '../../ha/hooks'
import { EntityAttributeInterface } from '../../ha/utils'
import { useHomeAssistant } from '../../contexts/HomeAssistantContext'

type ColorMode =
  | 'onoff'
  | 'brightness'
  | 'color_temp'
  | 'hs'
  | 'rgb'
  | 'rgbw'
  | 'rgbww'
  | 'white'
  | 'xy'

interface LightAttributesInterface extends EntityAttributeInterface {
  brightness: number
  color_temp_kelvin: number
  max_color_temp_kelvin?: number
  min_color_temp_kelvin?: number
  supported_color_modes: ColorMode[]
}

type LightType = 'bulb' | 'ceiling'
type LightTileProps = {
  title: string
  entityName: string
  lightType?: LightType
  disableToggle?: boolean
  allowManualControl?: boolean // TODO implement
}

const getStatusSubtitle = (isUnavailable: boolean, isActive: boolean) => {
  if (isUnavailable) return undefined
  return isActive ? 'On' : 'Off'
}

const getIcon = (lightType: LightType, isActive: boolean) => {
  switch (lightType) {
    case 'ceiling':
      return isActive ? <LightOutlinedIcon /> : <LightIcon />
    default:
      return isActive ? <LightbulbIcon /> : <LightbulbOutlinedIcon />
  }
}

const getMetadata = (
  isActive,
  attributes: EntityAttributeInterface
): string[] => {
  if (isActive) {
    const lightAttributes = attributes as LightAttributesInterface
    const brightness = lightAttributes?.brightness
    const colorTemp = lightAttributes?.color_temp_kelvin
    const lines = []
    if (brightness) {
      const brightnessPercentage = Math.round((brightness / 255) * 100)
      lines.push(`${brightnessPercentage}%`)
    }
    if (colorTemp) lines.push(`${colorTemp}K`)
    return lines
  }
  return undefined
}

const LightTile = ({
  title,
  entityName,
  lightType,
  disableToggle
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
    metadata: getMetadata(isActive, haEntity?.attributes),
    onClick: disableToggle ? undefined : toggleLight,
    isUnavailable
  }
  return <Tile {...tileData} />
}

LightTile.defaultProps = {
  lightType: 'bulb',
  disableToggle: false,
  allowManualControl: false
}

export default LightTile
