import { EntityState } from '../api/utils'

const BATTERY_ENTITY_PATTERN = /^sensor\.(.+)_battery$/

export type BatteryState = {
  entity: EntityState
  friendlyName: string
  level: number | undefined
}

export const readBatteryEntity = (
  entity: EntityState
): BatteryState | undefined => {
  const match = entity.id.match(BATTERY_ENTITY_PATTERN)
  if (!match) return undefined

  const numericState =
    entity.state.trim() === '' ? Number.NaN : Number(entity.state)
  const friendlyName = entity.attributes.friendly_name
  const deviceName = friendlyName?.replace(/\s+battery$/i, '').trim()

  return {
    entity,
    friendlyName: deviceName || match[1],
    level: Number.isFinite(numericState) ? numericState : undefined
  }
}
