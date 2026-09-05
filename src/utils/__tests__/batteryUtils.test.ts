import { EntityState } from '../../api/utils'
import { readBatteryEntity } from '../batteryUtils'

const entity = (id: string, state: string, friendlyName?: string): EntityState => ({
  id,
  state,
  lastChanged: '',
  lastUpdated: '',
  attributes: { friendly_name: friendlyName }
})

describe('batteryUtils', () => {
  it('should read the level and device name from a battery entity', () => {
    expect(
      readBatteryEntity(
        entity('sensor.kitchen_motion_battery', '73', 'Kitchen motion Battery')
      )
    ).toEqual({
      entity: entity(
        'sensor.kitchen_motion_battery',
        '73',
        'Kitchen motion Battery'
      ),
      friendlyName: 'Kitchen motion',
      level: 73
    })
  })

  it('should preserve a zero battery level', () => {
    expect(
      readBatteryEntity(
        entity('sensor.remote_battery', '0', 'Remote Battery')
      )?.level
    ).toBe(0)
  })

  it('should return an undefined level for an unavailable battery entity', () => {
    expect(
      readBatteryEntity(
        entity('sensor.remote_battery', 'unavailable', 'Remote Battery')
      )?.level
    ).toBeUndefined()
  })

  it('should reject another entity even if it has a legacy battery attribute', () => {
    const legacy = entity('binary_sensor.remote_action', 'off', 'Remote')
    Object.assign(legacy.attributes, { battery: 15 })

    expect(readBatteryEntity(legacy)).toBeUndefined()
  })
})
