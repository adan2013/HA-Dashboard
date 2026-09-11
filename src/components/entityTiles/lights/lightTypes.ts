import { EntityAttributeInterface } from '../../../api/utils'

export type ColorMode =
  | 'onoff'
  | 'brightness'
  | 'color_temp'
  | 'hs'
  | 'rgb'
  | 'rgbw'
  | 'rgbww'
  | 'white'
  | 'xy'

export interface LightAttributesInterface extends EntityAttributeInterface {
  brightness?: number
  color_temp_kelvin?: number
  max_color_temp_kelvin?: number
  min_color_temp_kelvin?: number
  supported_color_modes?: ColorMode[]
  color_mode?: ColorMode
  hs_color?: [number, number]
  rgb_color?: [number, number, number]
}

export type LightType = 'bulb' | 'ceiling'
