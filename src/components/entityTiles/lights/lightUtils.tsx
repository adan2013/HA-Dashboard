import LightOutlinedIcon from '@mui/icons-material/LightOutlined'
import LightIcon from '@mui/icons-material/Light'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import { EntityAttributeInterface } from '../../../ha/utils'
import { LightAttributesInterface, LightType } from './lightTypes'

export const getStatusSubtitle = (
  isUnavailable: boolean,
  isActive: boolean
) => {
  if (isUnavailable) return undefined
  return isActive ? 'On' : 'Off'
}

export const getIcon = (lightType: LightType, isActive: boolean) => {
  switch (lightType) {
    case 'ceiling':
      return isActive ? <LightOutlinedIcon /> : <LightIcon />
    default:
      return isActive ? <LightbulbIcon /> : <LightbulbOutlinedIcon />
  }
}

export const getMetadata = (
  isActive,
  lockColorTemperature,
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
    if (colorTemp && !lockColorTemperature) lines.push(`${colorTemp}K`)
    return lines
  }
  return undefined
}
