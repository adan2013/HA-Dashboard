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
  return <div {...events}>BUTTON</div>
}

describe('useClickHoldLogic', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  it('should call onClick when the user clicks and releases before the delay', () => {
    const onClick = jest.fn()
    const onHold = jest.fn()
    render(<TestButton onClick={onClick} onHold={onHold} />)
    fireEvent.mouseDown(screen.getByText('BUTTON'))
    fireEvent.mouseUp(screen.getByText('BUTTON'))
    expect(onClick).toHaveBeenCalledTimes(1)
    fireEvent.touchStart(screen.getByText('BUTTON'))
    fireEvent.touchEnd(screen.getByText('BUTTON'))
    expect(onClick).toHaveBeenCalledTimes(2)
    expect(onHold).not.toHaveBeenCalled()
  })

  it('should call onHold when the user hold the button', () => {
    const onClick = jest.fn()
    const onHold = jest.fn()
    render(<TestButton onClick={onClick} onHold={onHold} />)
    fireEvent.mouseDown(screen.getByText('BUTTON'))
    jest.advanceTimersByTime(80)
    fireEvent.mouseUp(screen.getByText('BUTTON'))
    expect(onHold).toHaveBeenCalledTimes(1)
    fireEvent.touchStart(screen.getByText('BUTTON'))
    jest.advanceTimersByTime(80)
    fireEvent.touchEnd(screen.getByText('BUTTON'))
    expect(onHold).toHaveBeenCalledTimes(2)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should call onHold immediately if user use right mouse button', async () => {
    const onClick = jest.fn()
    const onHold = jest.fn()
    render(<TestButton onClick={onClick} onHold={onHold} />)
    fireEvent.contextMenu(screen.getByText('BUTTON'))
    expect(onClick).not.toHaveBeenCalled()
    expect(onHold).toHaveBeenCalledTimes(1)
  })

  // TODO add tests for the move event
})
