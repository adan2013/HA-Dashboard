import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import useMultipleClickHoldLogic from '../useMultipleClickHoldLogic'
import { holdTest } from '../../utils/testUtils'

const TestButton = ({
  onClick,
  onHold
}: {
  onClick: (num: number) => void
  onHold: () => void
}) => {
  const events = useMultipleClickHoldLogic(onClick, onHold, 50, {
    delay: 80
  })
  return <div {...events}>BUTTON</div>
}

describe('useMultipleClickHoldLogic', () => {
  it('should call onClick with the correct count of clicks', async () => {
    const onClick = jest.fn()
    const onHold = jest.fn()
    render(<TestButton onClick={onClick} onHold={onHold} />)

    const click = () => {
      fireEvent.mouseDown(screen.getByText('BUTTON'))
      fireEvent.mouseUp(screen.getByText('BUTTON'))
    }

    click()
    await waitFor(() => expect(onClick).toHaveBeenCalledWith(1), {
      timeout: 100
    })
    click()
    click()
    click()
    await waitFor(() => expect(onClick).toHaveBeenLastCalledWith(3), {
      timeout: 100
    })
    click()
    click()
    await waitFor(() => expect(onClick).toHaveBeenLastCalledWith(2), {
      timeout: 100
    })
    expect(onHold).not.toHaveBeenCalled()
  })

  it('should call onHold when the button is held', async () => {
    const onClick = jest.fn()
    const onHold = jest.fn()
    render(<TestButton onClick={onClick} onHold={onHold} />)
    fireEvent.mouseDown(screen.getByText('BUTTON'))
    await holdTest(110)
    fireEvent.mouseUp(screen.getByText('BUTTON'))
    expect(onClick).not.toHaveBeenCalled()
    expect(onHold).toHaveBeenCalledTimes(1)
  })
})
