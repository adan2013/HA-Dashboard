import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import useRemoteControl, { SupportedActions } from '../useRemoteControl'

const triggerRemoteControl = jest.fn()
jest.mock('../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
    triggerRemoteControl
  }))
}))

const defaultSupportedActions: SupportedActions = {
  double: true,
  triple: true,
  hold: true
}

const TestButton = ({ actions }: { actions?: SupportedActions }) => {
  const events = useRemoteControl(
    'RC-NAME',
    10,
    actions || defaultSupportedActions
  )
  return <div {...events}>BUTTON</div>
}

describe('useRemoteControl', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('should call mqtt with correct click payloads (single, double, triple)', async () => {
    render(<TestButton />)
    const click = () => {
      fireEvent.mouseDown(screen.getByText('BUTTON'))
      fireEvent.mouseUp(screen.getByText('BUTTON'))
    }
    click()
    await waitFor(() =>
      expect(triggerRemoteControl).toHaveBeenCalledWith('RC-NAME', 10, 'single')
    )
    click()
    click()
    await waitFor(() =>
      expect(triggerRemoteControl).toHaveBeenLastCalledWith(
        'RC-NAME',
        10,
        'double'
      )
    )
    click()
    click()
    click()
    await waitFor(() =>
      expect(triggerRemoteControl).toHaveBeenLastCalledWith(
        'RC-NAME',
        10,
        'triple'
      )
    )
  })

  it('should call mqtt with correct hold payload', async () => {
    render(<TestButton />)
    fireEvent.mouseDown(screen.getByText('BUTTON'))
    jest.advanceTimersByTime(1100)
    fireEvent.mouseUp(screen.getByText('BUTTON'))
    await waitFor(() =>
      expect(triggerRemoteControl).toHaveBeenCalledWith('RC-NAME', 10, 'hold')
    )
  })

  it('should not trigger double event if is not supported', async () => {
    render(
      <TestButton
        actions={{
          double: false,
          triple: true,
          hold: true
        }}
      />
    )
    const click = () => {
      fireEvent.mouseDown(screen.getByText('BUTTON'))
      fireEvent.mouseUp(screen.getByText('BUTTON'))
    }
    click()
    jest.advanceTimersByTime(1100)
    click()
    click()
    jest.advanceTimersByTime(1100)
    click()
    click()
    click()
    jest.advanceTimersByTime(1100)
    await waitFor(() => expect(triggerRemoteControl).toHaveBeenCalledTimes(2))
  })

  it('should not trigger hold event if is not supported', async () => {
    render(
      <TestButton
        actions={{
          double: true,
          triple: true,
          hold: false
        }}
      />
    )
    fireEvent.mouseDown(screen.getByText('BUTTON'))
    jest.advanceTimersByTime(1100)
    fireEvent.mouseUp(screen.getByText('BUTTON'))
    await waitFor(() => expect(triggerRemoteControl).not.toHaveBeenCalled())
  })
})
