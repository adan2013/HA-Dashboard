import { act, fireEvent, render, screen } from '@testing-library/react'
import RemoteControlTile, { Button } from '../RemoteControlTile'
import { SupportedActions } from '../../../hooks/useRemoteControl'

const testButtons: Button[] = ['B1', ['B2-1', 'B2-2'], 'B3', 'B4']

const supportedActions: SupportedActions = {
  double: true,
  triple: true,
  hold: true
}

const triggerRemoteControl = jest.fn()
jest.mock('../../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
    triggerRemoteControl
  }))
}))

describe('RemoteControlTile', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'PointerEvent', {
      writable: true,
      value: MouseEvent
    })
    jest.useFakeTimers()
  })

  beforeEach(() => {
    triggerRemoteControl.mockClear()
  })

  const renderTile = () =>
    render(
      <RemoteControlTile
        title="Remote"
        entityId="rcTest"
        buttons={testButtons}
        supportedActions={supportedActions}
      />
    )

  it('should display all buttons', () => {
    renderTile()
    expect(screen.getByText('Remote')).toBeVisible()
    expect(screen.getByText('B1')).toBeVisible()
    expect(screen.getByText('B2-1')).toBeVisible()
    expect(screen.getByText('B2-2')).toBeVisible()
    expect(screen.getByText('B3')).toBeVisible()
    expect(screen.getByText('B4')).toBeVisible()
    expect(screen.getByTestId('tile-bg').tagName).toBe('DIV')
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })

  it('should recognize multiple short presses inside custom body', () => {
    renderTile()
    const button = screen.getByRole('button', { name: 'B1' })
    fireEvent.click(button)
    fireEvent.click(button)
    act(() => jest.advanceTimersByTime(550))

    expect(triggerRemoteControl).toHaveBeenCalledTimes(1)
    expect(triggerRemoteControl).toHaveBeenCalledWith('rcTest', 1, 'double')
  })

  it('should recognize hold without emitting a short press', () => {
    renderTile()
    const button = screen.getByRole('button', { name: 'B1' })

    fireEvent.pointerDown(button, { button: 0, clientX: 10, clientY: 10 })
    act(() => jest.advanceTimersByTime(1100))
    fireEvent.pointerUp(button)
    fireEvent.click(button)
    act(() => jest.advanceTimersByTime(550))

    expect(triggerRemoteControl).toHaveBeenCalledTimes(1)
    expect(triggerRemoteControl).toHaveBeenCalledWith('rcTest', 1, 'hold')
  })

  it('should not emit a press while scrolling from a custom body button', () => {
    renderTile()
    const button = screen.getByRole('button', { name: 'B1' })

    fireEvent.pointerDown(button, { button: 0, clientX: 10, clientY: 10 })
    fireEvent.pointerMove(button, { clientX: 12, clientY: 40 })
    act(() => jest.advanceTimersByTime(1100))
    fireEvent.pointerUp(button)
    fireEvent.click(button)
    act(() => jest.advanceTimersByTime(550))

    expect(triggerRemoteControl).not.toHaveBeenCalled()
  })
})
