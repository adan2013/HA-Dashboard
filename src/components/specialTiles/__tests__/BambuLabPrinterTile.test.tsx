import { render, screen } from '@testing-library/react'
import { getMockedEntityState } from '../../../utils/testUtils'
import BambuLabPrinterTile from '../BambuLabPrinterTile'

type EntityMock = [string, string]

const mocks: EntityMock[] = [
  ['sensor.ID_print_status', 'prepare'],
  ['sensor.ID_current_stage', 'heating_hotend'],
  ['sensor.ID_current_layer', '47'],
  ['sensor.ID_total_layer_count', '530'],
  ['sensor.ID_remaining_time', '128'],
  ['sensor.ID_speed_profile', 'silent'],
  ['sensor.ID_nozzle_size', '0.4'],
  ['sensor.ID_nozzle_temperature', '27'],
  ['sensor.ID_nozzle_target_temperature', '220'],
  ['sensor.ID_bed_temperature', '25'],
  ['sensor.ID_target_bed_temperature', '55'],
  ['sensor.ID_aux_fan_speed', '40'],
  ['sensor.ID_chamber_fan_speed', '0'],
  ['sensor.ID_cooling_fan_speed', '100'],
  ['sensor.ID_active_tray', 'Bambu PLA Basic']
]

jest.mock('../../../api/hooks', () => {
  const originalModule = jest.requireActual('../../../api/hooks')

  return {
    __esModule: true,
    ...originalModule,
    useHomeAssistantEntity: jest.fn(entityId => {
      const mock = mocks.find(m => m[0] === entityId)
      if (mock) {
        return getMockedEntityState(mock[0], mock[1])
      }
      return {
        entityState: null,
        isUnavailable: true
      }
    })
  }
})

describe('BambuLabPrinterTile', () => {
  it('should display the correct printer status', () => {
    render(<BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />)
    expect(screen.getByText('BambuLab Printer')).toBeVisible()
    expect(screen.getByText('Prepare')).toBeVisible()
    expect(screen.getByText('Stage: Heating hotend')).toBeVisible()
    expect(screen.getByText('47 / 530')).toBeVisible()
    expect(screen.getByText('2h 8m')).toBeVisible()
    expect(screen.getByText('Silent')).toBeVisible()
    expect(screen.getByText('0.4 mm')).toBeVisible()
    expect(screen.getByText('27 → 220°C')).toBeVisible()
    expect(screen.getByText('25 → 55°C')).toBeVisible()
    expect(screen.getByText('40%')).toBeVisible()
    expect(screen.getByText('0%')).toBeVisible()
    expect(screen.getByText('100%')).toBeVisible()
    expect(screen.getByText('Bambu PLA Basic')).toBeVisible()
  })
})
