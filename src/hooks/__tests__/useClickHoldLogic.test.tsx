import { fireEvent, render, screen } from '@testing-library/react'
import useClickHoldLogic from '../useClickHoldLogic'

const TestButton = ({
  onClick,
  onHold
}: {
  onClick: () => void
  onHold: () => void
}) => {
  const events = useClickHoldLogic(onClick, onHold, {
    delay: 50
  })
  return (
    <button type="button" {...events}>
      BUTTON
    </button>
  )
}

describe('useClickHoldLogic', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'PointerEvent', {
      writable: true,
      value: MouseEvent
    })
    jest.useFakeTimers()
  })

  it('should call onClick when the user clicks and releases before the delay', () => {
    const onClick = jest.fn()
    const onHold = jest.fn()
    render(<TestButton onClick={onClick} onHold={onHold} />)
    fireEvent.pointerDown(screen.getByText('BUTTON'), {
      button: 0,
      clientX: 10,
      clientY: 10
    })
    fireEvent.pointerUp(screen.getByText('BUTTON'))
    fireEvent.click(screen.getByText('BUTTON'))
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onHold).not.toHaveBeenCalled()
  })

  it('should call onHold when the user hold the button', () => {
    const onClick = jest.fn()
    const onHold = jest.fn()
    render(<TestButton onClick={onClick} onHold={onHold} />)
    fireEvent.pointerDown(screen.getByText('BUTTON'), {
      button: 0,
      clientX: 10,
      clientY: 10
    })
    jest.advanceTimersByTime(80)
    fireEvent.pointerUp(screen.getByText('BUTTON'))
    fireEvent.click(screen.getByText('BUTTON'))
    expect(onHold).toHaveBeenCalledTimes(1)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should not click or hold when a pointer movement becomes a scroll', () => {
    const onClick = jest.fn()
    const onHold = jest.fn()
    render(<TestButton onClick={onClick} onHold={onHold} />)
    const button = screen.getByText('BUTTON')

    fireEvent.pointerDown(button, { button: 0, clientX: 10, clientY: 10 })
    fireEvent.pointerMove(button, { clientX: 12, clientY: 35 })
    jest.advanceTimersByTime(80)
    fireEvent.pointerUp(button)
    fireEvent.click(button)

    expect(onClick).not.toHaveBeenCalled()
    expect(onHold).not.toHaveBeenCalled()
  })

  it('should cancel the gesture when the browser takes over the pointer', () => {
    const onClick = jest.fn()
    const onHold = jest.fn()
    render(<TestButton onClick={onClick} onHold={onHold} />)
    const button = screen.getByText('BUTTON')

    fireEvent.pointerDown(button, { button: 0, clientX: 10, clientY: 10 })
    fireEvent.pointerCancel(button)
    jest.advanceTimersByTime(80)
    fireEvent.click(button)

    expect(onClick).not.toHaveBeenCalled()
    expect(onHold).not.toHaveBeenCalled()
  })

  it('should call onHold immediately if user use right mouse button', async () => {
    const onClick = jest.fn()
    const onHold = jest.fn()
    render(<TestButton onClick={onClick} onHold={onHold} />)
    fireEvent.contextMenu(screen.getByText('BUTTON'))
    expect(onClick).not.toHaveBeenCalled()
    expect(onHold).toHaveBeenCalledTimes(1)
  })
})
