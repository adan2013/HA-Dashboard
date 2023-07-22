import LightOutlinedIcon from '@mui/icons-material/LightOutlined'
import LightIcon from '@mui/icons-material/Light'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import { EntityAttributeInterface } from '../../../api/utils'
import { LightAttributesInterface, LightType } from './lightTypes'

export const getStatusSubtitle = (
  isUnavailable: boolean,
  isActive: boolean
) => {
  if (isUnavailable) return undefined
  return isActive ? 'on' : 'off'
}

export const getIcon = (lightType: LightType, isActive: boolean) => {
  switch (lightType) {
    case 'ceiling':
      return isActive ? <LightIcon /> : <LightOutlinedIcon />
    default:
      return isActive ? <LightbulbOutlinedIcon /> : <LightbulbIcon />
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
