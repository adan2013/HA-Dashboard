import { act, fireEvent, screen } from '@testing-library/react'
import {
  getMockedEntityState,
  renderModalBody
} from '../../../../utils/testUtils'
import RadiatorControlBody from '../RadiatorControlBody'

const callService = jest.fn()
jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: () => ({ callService })
}))

jest.mock('../../../../api/hooks', () => ({
  useHomeAssistantEntity: jest.fn()
}))

// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
const { useHomeAssistantEntity } = require('../../../../api/hooks')

const params = {
  title: 'Daniel',
  entityId: 'climate.danielradiatorvalve',
  batteryEntityId: 'sensor.danielradiatorvalve_battery'
}

const renderBody = (state = 'heat', action = 'heating') => {
  useHomeAssistantEntity.mockImplementation((id: string) => {
    if (id === params.entityId)
      return getMockedEntityState(id, state, {
        temperature: 26,
        current_temperature: 24.3,
        hvac_action: action,
        hvac_modes: ['off', 'auto', 'heat'],
        min_temp: 4,
        max_temp: 35,
        target_temp_step: 0.5
      })
    return getMockedEntityState(id, '100')
  })
  return renderModalBody(<RadiatorControlBody />, 'radiatorControl', params)
}

describe('RadiatorControlBody', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('renders internal progress, setpoint marker and internal status', () => {
    renderBody()
    expect(screen.getByText('Internal 24.3°C')).toBeInTheDocument()
    expect(screen.getByText('26.0°C')).toBeInTheDocument()
    expect(
      Number.parseFloat(
        screen.getByTestId('radiator-temperature-fill').style.width
      )
    ).toBeCloseTo(65.48)
    expect(
      Number.parseFloat(screen.getByTestId('radiator-target-marker').style.left)
    ).toBeCloseTo(70.97)
    expect(screen.getByText('Battery 100%')).toBeInTheDocument()
    expect(useHomeAssistantEntity).toHaveBeenCalledWith(params.entityId)
    expect(useHomeAssistantEntity).toHaveBeenCalledWith(params.batteryEntityId)
    expect(useHomeAssistantEntity).toHaveBeenCalledTimes(2)
    expect(screen.getByRole('button', { name: 'Manual' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByTestId('radiator-temperature-fill')).toHaveClass(
      'bg-orange-500'
    )
    expect(screen.getByTestId('radiator-temperature-fill')).not.toHaveClass(
      'transition-all'
    )
  })

  it('debounces repeated half-degree changes into one HA call', () => {
    renderBody()
    const increase = screen.getByRole('button', {
      name: 'Increase target temperature'
    })
    fireEvent.click(increase)
    fireEvent.click(increase)
    fireEvent.click(increase)
    expect(screen.getByText('27.5°C')).toBeInTheDocument()
    expect(callService).not.toHaveBeenCalled()
    act(() => jest.advanceTimersByTime(700))
    expect(callService).toHaveBeenCalledTimes(1)
    expect(callService).toHaveBeenCalledWith(
      params.entityId,
      'climate',
      'set_temperature',
      { temperature: 27.5 }
    )
  })

  it('uses supported HA HVAC modes and flushes pending temperature on close', () => {
    const { closeModalMock } = renderBody()
    fireEvent.click(screen.getByRole('button', { name: 'Auto' }))
    expect(callService).toHaveBeenCalledWith(
      params.entityId,
      'climate',
      'set_hvac_mode',
      { hvac_mode: 'auto' }
    )
    fireEvent.click(
      screen.getByRole('button', {
        name: 'Increase target temperature'
      })
    )
    fireEvent.click(screen.getByTestId('modal-button-Close'))
    expect(callService).toHaveBeenLastCalledWith(
      params.entityId,
      'climate',
      'set_temperature',
      { temperature: 26.5 }
    )
    expect(closeModalMock).toHaveBeenCalled()
  })

  it('uses a blue fill while idle', () => {
    renderBody('heat', 'idle')
    expect(screen.getByTestId('radiator-temperature-fill')).toHaveClass(
      'bg-blue-500'
    )
  })

  it('maps Manual to heat and Off to off for these valves', () => {
    renderBody('auto', 'idle')
    fireEvent.click(screen.getByRole('button', { name: 'Manual' }))
    fireEvent.click(screen.getByRole('button', { name: 'Off' }))
    expect(callService).toHaveBeenNthCalledWith(
      1,
      params.entityId,
      'climate',
      'set_hvac_mode',
      { hvac_mode: 'heat' }
    )
    expect(callService).toHaveBeenNthCalledWith(
      2,
      params.entityId,
      'climate',
      'set_hvac_mode',
      { hvac_mode: 'off' }
    )
  })
})
