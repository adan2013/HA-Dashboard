import LightOutlinedIcon from '@mui/icons-material/LightOutlined'
import LightIcon from '@mui/icons-material/Light'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import { EntityAttributeInterface } from '../../../api/utils'
import { LightAttributesInterface, LightType } from './lightTypes'

const COLOR_MODES = ['hs', 'rgb', 'rgbw', 'rgbww', 'xy']

export const getStatusSubtitle = (
  isUnavailable: boolean,
  isActive: boolean
) => {
  if (isUnavailable) return undefined
  return isActive ? 'on' : 'off'
}

export const getIcon = (
  lightType: LightType,
  isActive: boolean,
  color?: string
) => {
  const style = color ? { color } : undefined
  switch (lightType) {
    case 'ceiling':
      return isActive ? <LightIcon style={style} /> : <LightOutlinedIcon />
    default:
      return isActive ? (
        <LightbulbIcon style={style} />
      ) : (
        <LightbulbOutlinedIcon />
      )
  }
}

export const supportsColor = (attributes?: EntityAttributeInterface) => {
  const lightAttributes = attributes as LightAttributesInterface
  const supportedColorModes = lightAttributes?.supported_color_modes
  if (supportedColorModes) {
    return supportedColorModes.some(mode => COLOR_MODES.includes(mode))
  }
  return COLOR_MODES.includes(lightAttributes?.color_mode)
}

const rgbToHex = ([red, green, blue]: [number, number, number]) =>
  `#${[red, green, blue]
    .map(value => Math.round(value).toString(16).padStart(2, '0'))
    .join('')}`.toUpperCase()

export const hsToHex = (hue: number, saturation = 100) => {
  const normalizedHue = ((hue % 360) + 360) % 360
  const chroma = saturation / 100
  const secondary =
    chroma * (1 - Math.abs(((normalizedHue / 60) % 2) - 1))
  const offset = 1 - chroma

  let color: [number, number, number]
  if (normalizedHue < 60) color = [chroma, secondary, 0]
  else if (normalizedHue < 120) color = [secondary, chroma, 0]
  else if (normalizedHue < 180) color = [0, chroma, secondary]
  else if (normalizedHue < 240) color = [0, secondary, chroma]
  else if (normalizedHue < 300) color = [secondary, 0, chroma]
  else color = [chroma, 0, secondary]

  return rgbToHex(
    color.map(value => (value + offset) * 255) as [number, number, number]
  )
}

export const getLightColor = (attributes?: EntityAttributeInterface) => {
  if (!supportsColor(attributes)) return undefined
  const lightAttributes = attributes as LightAttributesInterface
  if (lightAttributes?.rgb_color) return rgbToHex(lightAttributes.rgb_color)
  if (lightAttributes?.hs_color) {
    const [hue, saturation] = lightAttributes.hs_color
    return hsToHex(hue, saturation)
  }
  return undefined
}

export const getHue = (attributes?: EntityAttributeInterface) => {
  const lightAttributes = attributes as LightAttributesInterface
  if (lightAttributes?.hs_color) return lightAttributes.hs_color[0]
  if (!lightAttributes?.rgb_color) return 0

  const [red, green, blue] = lightAttributes.rgb_color.map(value => value / 255)
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  if (delta === 0) return 0

  let hue: number
  if (max === red) hue = ((green - blue) / delta) % 6
  else if (max === green) hue = (blue - red) / delta + 2
  else hue = (red - green) / delta + 4
  return Math.round((hue * 60 + 360) % 360)
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
    const color = getLightColor(attributes)
    const lines = []
    if (brightness) {
      const brightnessPercentage = Math.round((brightness / 255) * 100)
      lines.push(`${brightnessPercentage}%`)
    }
    if (colorTemp && !lockColorTemperature) lines.push(`${colorTemp}K`)
    if (color) lines.push(color)
    return lines
  }
  return undefined
}
