import { render, screen } from '@testing-library/react'
import WaterLeakSensorTile from '../WaterLeakSensorTile'

jest.mock('../../../../api/hooks', () => ({
  useHomeAssistantEntity: (entityId: string) => ({
    entityState:
      entityId === 'sensor.leak_battery'
        ? {
            id: entityId,
            state: '25',
            lastChanged: '',
            lastUpdated: '',
            attributes: { friendly_name: 'Leak Battery' }
          }
        : {
            id: entityId,
            state: 'off',
            lastChanged: '',
            lastUpdated: '',
            attributes: { friendly_name: 'Leak' }
          },
    isUnavailable: false
  })
}))

describe('WaterLeakSensorTile', () => {
  it('should display the level from the dedicated battery entity', () => {
    render(
      <WaterLeakSensorTile
        title="Leak sensor"
        entityId="binary_sensor.leak_water_leak"
        batteryEntityId="sensor.leak_battery"
      />
    )

    expect(screen.getByText('Leak sensor')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
  })
})
