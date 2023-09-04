import { extractDeviceNameFromFriendlyName } from '../utils'

describe('api/utils', () => {
  it('should extract the device name from friendly_name', () => {
    expect(
      extractDeviceNameFromFriendlyName(
        'livingRoomTemperatureSensor temperature'
      )
    ).toBe('livingRoomTemperatureSensor')
    expect(
      extractDeviceNameFromFriendlyName('livingRoomTemperatureSensor humidity')
    ).toBe('livingRoomTemperatureSensor')
    expect(
      extractDeviceNameFromFriendlyName('livingRoomTemperatureSensor')
    ).toBe('livingRoomTemperatureSensor')
  })
})
