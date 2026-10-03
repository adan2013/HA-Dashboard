import { EntityState } from '../../../api/utils'

export type RadiatorMode = 'off' | 'manual' | 'auto'

export const formatRadiatorMode = (mode: RadiatorMode) =>
  mode.charAt(0).toUpperCase() + mode.slice(1)

export const readTemperature = (value: string | number | undefined) => {
  if (value === undefined || value === '') return null
  const temperature = Number(value)
  return Number.isFinite(temperature) ? temperature : null
}

export const formatTemperature = (value: number | null) =>
  value === null ? '--' : `${value.toFixed(1)}°C`

export const readRadiatorMode = (entity: EntityState): RadiatorMode => {
  if (entity?.state === 'off') return 'off'
  if (entity?.attributes?.preset_mode === 'auto' || entity?.state === 'auto')
    return 'auto'
  return 'manual'
}

export const readRadiatorAction = (entity: EntityState) =>
  entity?.attributes?.hvac_action === 'heating' ? 'Heating' : 'Idle'

export const getTemperatureRange = (entity: EntityState) => {
  const min = entity?.attributes?.min_temp ?? 5
  const max = entity?.attributes?.max_temp ?? 30
  return max > min ? { min, max } : { min: 5, max: 30 }
}

export const getTemperatureStep = (entity: EntityState) => {
  const step = entity?.attributes?.target_temp_step
  return step && step > 0 ? step : 0.5
}

export const temperaturePercentage = (
  temperature: number | null,
  min: number,
  max: number
) =>
  temperature === null
    ? 0
    : Math.min(100, Math.max(0, ((temperature - min) / (max - min)) * 100))

export const getModeService = (
  entity: EntityState,
  mode: RadiatorMode
): { service: string; data: object } => {
  if (mode === 'off')
    return { service: 'set_hvac_mode', data: { hvac_mode: 'off' } }
  if (entity?.attributes?.preset_modes?.includes(mode))
    return { service: 'set_preset_mode', data: { preset_mode: mode } }
  return {
    service: 'set_hvac_mode',
    data: {
      hvac_mode:
        mode === 'manual' && entity?.attributes?.hvac_modes?.includes('heat')
          ? 'heat'
          : mode
    }
  }
}
