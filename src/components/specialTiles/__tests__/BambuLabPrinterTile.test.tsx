import { render, screen } from '@testing-library/react'
import { useHomeAssistantEntity } from '../../../api/hooks'
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
    useHomeAssistantEntity: jest.fn()
  }
})

describe('BambuLabPrinterTile', () => {
  beforeEach(() => {
    jest.mocked(useHomeAssistantEntity).mockImplementation(entityId => {
      const mock = mocks.find(m => m[0] === entityId)
      return getMockedEntityState(entityId, mock?.[1] ?? 'unknown')
    })
  })

  it('should not render NaN when remaining time is unavailable after HA restarts', () => {
    jest
      .mocked(useHomeAssistantEntity)
      .mockImplementation(entityId =>
        getMockedEntityState(
          entityId,
          entityId.endsWith('_remaining_time')
            ? 'unavailable'
            : mocks.find(m => m[0] === entityId)?.[1] ?? 'unknown'
        )
      )

    render(<BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />)
    expect(screen.getByTestId('tile-custom-body')).not.toHaveTextContent('NaN')
    expect(screen.getByText('--')).toBeVisible()
    expect(screen.getByText('47 / 530')).toBeVisible()
  })

  it.each(['unavailable', 'unknown', '', '   '])(
    'should show missing data instead of fabricated readings for %p states',
    state => {
      jest
        .mocked(useHomeAssistantEntity)
        .mockImplementation(entityId => getMockedEntityState(entityId, state))

      render(<BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />)

      expect(screen.getByText('Unavailable')).toBeVisible()
      expect(screen.getByTestId('unavailable-tile')).toBeVisible()
      expect(screen.getByText('Stage: Unknown')).toBeVisible()
      expect(screen.getByText('-- / --')).toBeVisible()
      expect(screen.getAllByText('-- → --°C')).toHaveLength(2)
      expect(screen.getAllByText('--%')).toHaveLength(3)
      expect(screen.queryByText('Not selected')).not.toBeInTheDocument()
      expect(screen.getByTestId('tile-custom-body')).not.toHaveTextContent(
        /NaN|Infinity|0h 0m|0 \/ 0|unavailable mm/
      )
    }
  )

  it.each(['NaN', 'Infinity', '-Infinity', '-1', '12oops', '0x10', '1e309'])(
    'should reject invalid numeric telemetry %p',
    state => {
      jest.mocked(useHomeAssistantEntity).mockImplementation(entityId => {
        const mock = mocks.find(m => m[0] === entityId)
        const isNumeric = mock && Number.isFinite(Number(mock[1]))
        return getMockedEntityState(entityId, isNumeric ? state : mock?.[1])
      })

      render(<BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />)

      expect(screen.getByText('Prepare')).toBeVisible()
      expect(screen.getByText('-- / --')).toBeVisible()
      expect(screen.getAllByText('-- → --°C')).toHaveLength(2)
      expect(screen.getAllByText('--%')).toHaveLength(3)
      expect(screen.getAllByText('--')).toHaveLength(2)
    }
  )

  it('should preserve real zero measurements', () => {
    jest.mocked(useHomeAssistantEntity).mockImplementation(entityId => {
      const mock = mocks.find(m => m[0] === entityId)
      const isNumeric = mock && Number.isFinite(Number(mock[1]))
      return getMockedEntityState(entityId, isNumeric ? '0' : mock?.[1])
    })

    render(<BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />)

    expect(screen.getByText('0 / 0')).toBeVisible()
    expect(screen.getByText('0h 0m')).toBeVisible()
    expect(screen.getAllByText('0 → 0°C')).toHaveLength(2)
    expect(screen.getAllByText('0%')).toHaveLength(3)
    expect(screen.queryByText('0 mm')).not.toBeInTheDocument()
  })

  it('should reject fractional layers and fan percentages outside their range', () => {
    jest.mocked(useHomeAssistantEntity).mockImplementation(entityId => {
      const mock = mocks.find(m => m[0] === entityId)
      let state = mock?.[1]
      if (entityId.endsWith('_current_layer')) state = '2.5'
      if (entityId.endsWith('_fan_speed')) state = '101'
      if (entityId.endsWith('_remaining_time')) state = '128.75'
      return getMockedEntityState(entityId, state)
    })

    render(<BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />)

    expect(screen.getByText('-- / 530')).toBeVisible()
    expect(screen.getAllByText('--%')).toHaveLength(3)
    expect(screen.getByText('2h 8m')).toBeVisible()
  })

  it('should clear readings during a restart and restore them after reconnection', () => {
    const { rerender } = render(
      <BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />
    )
    expect(screen.getByText('2h 8m')).toBeVisible()

    jest.mocked(useHomeAssistantEntity).mockReturnValue({
      entityState: null,
      isUnavailable: true,
      isLoading: false
    })
    rerender(<BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />)
    expect(screen.getByText('-- / --')).toBeVisible()
    expect(screen.queryByText('2h 8m')).not.toBeInTheDocument()

    jest.mocked(useHomeAssistantEntity).mockImplementation(entityId => ({
      ...getMockedEntityState(
        entityId,
        mocks.find(m => m[0] === entityId)?.[1]
      ),
      isLoading: true
    }))
    rerender(<BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />)
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true')

    jest
      .mocked(useHomeAssistantEntity)
      .mockImplementation(entityId =>
        getMockedEntityState(entityId, mocks.find(m => m[0] === entityId)?.[1])
      )
    rerender(<BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />)
    expect(screen.getByText('2h 8m')).toBeVisible()
    expect(screen.queryByTestId('unavailable-tile')).not.toBeInTheDocument()
  })

  it('should ignore stale values on entities marked unavailable', () => {
    jest.mocked(useHomeAssistantEntity).mockImplementation(entityId => ({
      ...getMockedEntityState(
        entityId,
        mocks.find(m => m[0] === entityId)?.[1]
      ),
      isUnavailable: true
    }))

    render(<BambuLabPrinterTile title="BambuLab Printer" mainEntityId="ID" />)

    expect(screen.getByText('Unavailable')).toBeVisible()
    expect(screen.getByText('-- / --')).toBeVisible()
    expect(screen.getAllByText('-- → --°C')).toHaveLength(2)
    expect(screen.getAllByText('--%')).toHaveLength(3)
    expect(screen.queryByText('Bambu PLA Basic')).not.toBeInTheDocument()
  })

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
