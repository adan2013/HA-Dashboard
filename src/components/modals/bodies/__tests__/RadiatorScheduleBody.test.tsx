import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { useHomeAssistantEntity } from '../../../../api/hooks'
import {
  getMockedEntityState,
  renderModalBody
} from '../../../../utils/testUtils'
import RadiatorScheduleBody from '../RadiatorScheduleBody'

const callService = jest.fn()
jest.mock('../../../../contexts/BackendContext', () => ({
  useBackend: () => ({ callService })
}))
jest.mock('../../../../api/hooks', () => ({
  useHomeAssistantEntity: jest.fn()
}))

const params = {
  title: 'Daniel',
  entityId: 'climate.danielradiatorvalve',
  batteryEntityId: 'sensor.danielradiatorvalve_battery',
  scheduleEntityPrefix: 'text.danielradiatorvalve_weekly_schedule'
}
const original = '00:00/16 07:00/19 10:00/16 10:00/16 17:00/19 23:00/16'
const states: Record<string, string> = {}
const button = (name: string) => screen.getByRole('button', { name })
const renderBody = () =>
  renderModalBody(<RadiatorScheduleBody />, 'radiatorSchedule', params)

beforeEach(() => {
  Object.keys(states).forEach(key => delete states[key])
  callService.mockReset().mockResolvedValue(undefined)
  jest.mocked(useHomeAssistantEntity).mockImplementation(id => {
    const state = id === params.entityId ? 'heat' : states[id] ?? original
    return {
      ...getMockedEntityState(id, state),
      isUnavailable: state === 'unavailable'
    }
  })
})

describe('RadiatorScheduleBody', () => {
  it('renders seven days, the manual mode notice, and thermostat navigation', () => {
    const { openModalMock, closeModalMock } = renderBody()
    expect(screen.getAllByRole('button', { name: /^Edit / })).toHaveLength(7)
    expect(screen.getByText(/Schedule inactive/)).toBeVisible()
    fireEvent.click(button('Back to thermostat'))
    expect(openModalMock).toHaveBeenCalledWith('radiatorControl', params)
    fireEvent.click(button('Close'))
    expect(closeModalMock).toHaveBeenCalledTimes(1)
  })

  it('edits in chronological order, selects the new midpoint, and caps at six points', () => {
    renderBody()
    fireEvent.click(button('Edit Monday'))
    expect(screen.getByText('Point 1 of 5')).toBeVisible()
    expect(button('Increase hours')).toBeDisabled()
    expect(button('Decrease minutes')).toBeDisabled()
    expect(button('Remove point')).toBeDisabled()
    fireEvent.click(button('Add point'))
    expect(screen.getByText('Point 2 of 6')).toBeVisible()
    expect(screen.getByLabelText('Hours')).toHaveTextContent('03')
    expect(screen.getByLabelText('Minutes')).toHaveTextContent('30')
    expect(screen.getByLabelText('Temperature')).toHaveTextContent('16.0°')
    expect(button('Add point')).toBeDisabled()
    fireEvent.click(button('Increase minutes'))
    expect(screen.getByLabelText('Minutes')).toHaveTextContent('35')
    fireEvent.click(button('Increase temperature'))
    expect(screen.getByLabelText('Temperature')).toHaveTextContent('16.5°')
    fireEvent.click(button('Remove point'))
    expect(screen.getByText('Point 1 of 5')).toBeVisible()
    fireEvent.click(button('Next point'))
    fireEvent.click(button('Increase hours'))
    fireEvent.click(button('Increase hours'))
    expect(screen.getByLabelText('Hours')).toHaveTextContent('09')
    expect(button('Increase hours')).toBeDisabled()
  })

  it('discards through the footer and through the Escape/backdrop handler without writing', () => {
    const { dismissModal, closeModalMock } = renderBody()
    fireEvent.click(button('Edit Monday'))
    fireEvent.click(button('Increase temperature'))
    fireEvent.click(button('Discard'))
    fireEvent.click(button('Edit Monday'))
    expect(screen.getByLabelText('Temperature')).toHaveTextContent('16.0°')
    fireEvent.click(button('Increase temperature'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(button('Edit Monday')).toBeVisible()
    expect(closeModalMock).not.toHaveBeenCalled()
    expect(callService).not.toHaveBeenCalled()
    act(dismissModal)
    expect(closeModalMock).toHaveBeenCalledTimes(1)
  })

  it('saves one normalized day, blocks dismiss while pending, and never changes HVAC mode', async () => {
    let resolve: () => void
    callService.mockImplementation(
      () =>
        new Promise<void>(done => {
          resolve = done
        })
    )
    const { dismissModal } = renderBody()
    fireEvent.click(button('Edit Monday'))
    fireEvent.click(button('Increase temperature'))
    fireEvent.click(button('Save'))
    expect(button('Discard')).toBeDisabled()
    act(dismissModal)
    expect(screen.getByLabelText('Temperature')).toBeVisible()
    await act(async () => resolve())
    expect(callService).toHaveBeenCalledTimes(1)
    expect(callService).toHaveBeenCalledWith(
      `${params.scheduleEntityPrefix}_monday`,
      'text',
      'set_value',
      { value: '00:00/16.5 07:00/19 10:00/16 17:00/19 23:00/16' }
    )
    expect(button('Edit Monday')).toBeVisible()
    fireEvent.click(button('Edit Monday'))
    expect(screen.getByLabelText('Temperature')).toHaveTextContent('16.5°')
  })

  it('keeps the draft after a failed save and allows retry', async () => {
    callService.mockRejectedValueOnce(new Error('offline'))
    renderBody()
    fireEvent.click(button('Edit Monday'))
    fireEvent.click(button('Increase temperature'))
    fireEvent.click(button('Save'))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Your changes are still here'
    )
    expect(screen.getByLabelText('Temperature')).toHaveTextContent('16.5°')
    fireEvent.click(button('Save'))
    await waitFor(() => expect(button('Edit Monday')).toBeVisible())
    expect(callService).toHaveBeenCalledTimes(2)
  })

  it('clones only to selected targets and retries only failed days', async () => {
    callService.mockImplementation((id: string) =>
      id.endsWith('wednesday')
        ? Promise.reject(new Error('failed'))
        : Promise.resolve()
    )
    const { dismissModal } = renderBody()
    fireEvent.click(button('Clone Monday'))
    expect(button('Monday Source')).toBeDisabled()
    expect(button('Copy to selected days')).toBeDisabled()
    fireEvent.click(button('Tuesday'))
    fireEvent.click(button('Wednesday'))
    fireEvent.click(button('Copy to selected days'))
    act(dismissModal)
    expect(button('Cancel')).toBeDisabled()
    expect(await screen.findByRole('alert')).toHaveTextContent('Wednesday')
    expect(button('Tuesday Saved')).toBeDisabled()
    expect(callService).toHaveBeenCalledTimes(2)
    callService.mockResolvedValue(undefined)
    fireEvent.click(button('Copy to selected days'))
    await waitFor(() => expect(button('Edit Monday')).toBeVisible())
    expect(callService).toHaveBeenCalledTimes(3)
    expect(callService).toHaveBeenLastCalledWith(
      `${params.scheduleEntityPrefix}_wednesday`,
      'text',
      'set_value',
      { value: '00:00/16 07:00/19 10:00/16 17:00/19 23:00/16' }
    )
  })

  it('blocks unavailable and invalid days but initializes an empty day at 20°C', () => {
    states[`${params.scheduleEntityPrefix}_monday`] = 'unavailable'
    states[`${params.scheduleEntityPrefix}_tuesday`] =
      '00:00/16 10:00/16 10:00/19'
    states[`${params.scheduleEntityPrefix}_wednesday`] = ''
    renderBody()
    expect(button('Edit Monday')).toBeDisabled()
    expect(button('Clone Monday')).toBeDisabled()
    expect(button('Edit Tuesday')).toBeDisabled()
    fireEvent.click(button('Edit Wednesday'))
    expect(screen.getByLabelText('Temperature')).toHaveTextContent('20.0°')
    expect(screen.getByText('Point 1 of 1')).toBeVisible()
    expect(callService).not.toHaveBeenCalled()
  })
})
