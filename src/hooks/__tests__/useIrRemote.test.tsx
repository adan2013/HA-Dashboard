import { act, fireEvent, render, screen } from '@testing-library/react'
import useIrRemote from '../useIrRemote'

const callService = jest.fn()
jest.mock('../../contexts/BackendContext', () => ({
  useBackend: jest.fn(() => ({
    callService
  }))
}))

const TestRemote = () => {
  const { send, sendingButtonId } = useIrRemote()
  return (
    <div>
      <button type="button" onClick={() => send('first', 'CODE-1')}>
        FIRST
      </button>
      <button type="button" onClick={() => send('second', 'CODE-2')}>
        SECOND
      </button>
      <button type="button" onClick={() => send('empty', '')}>
        EMPTY
      </button>
      <div data-testid="sending">{sendingButtonId ?? 'none'}</div>
    </div>
  )
}

const flushLock = async (ms = 500) => {
  await act(async () => {
    jest.advanceTimersByTime(ms)
  })
}

describe('useIrRemote', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })

  beforeEach(() => {
    callService.mockResolvedValue(undefined)
  })

  it('should publish the IR code over mqtt', async () => {
    render(<TestRemote />)
    fireEvent.click(screen.getByText('FIRST'))
    expect(callService).toHaveBeenCalledWith(undefined, 'mqtt', 'publish', {
      topic: 'zigbee2mqtt/livingRoomIrRemote/set',
      payload: JSON.stringify({ ir_code_to_send: 'CODE-1' })
    })
    await flushLock()
  })

  it('should ignore other presses until the current one is sent', async () => {
    render(<TestRemote />)
    fireEvent.click(screen.getByText('FIRST'))
    fireEvent.click(screen.getByText('SECOND'))
    expect(screen.getByTestId('sending')).toHaveTextContent('first')
    expect(callService).toHaveBeenCalledTimes(1)

    await flushLock()
    expect(screen.getByTestId('sending')).toHaveTextContent('none')
    fireEvent.click(screen.getByText('SECOND'))
    expect(callService).toHaveBeenCalledTimes(2)
    await flushLock()
  })

  it('should keep the lock for the minimal time even if sending is fast', async () => {
    render(<TestRemote />)
    fireEvent.click(screen.getByText('FIRST'))
    await flushLock(300)
    expect(screen.getByTestId('sending')).toHaveTextContent('first')
    await flushLock(200)
    expect(screen.getByTestId('sending')).toHaveTextContent('none')
  })

  it('should not send an empty code', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    render(<TestRemote />)
    fireEvent.click(screen.getByText('EMPTY'))
    expect(callService).not.toHaveBeenCalled()
    expect(screen.getByTestId('sending')).toHaveTextContent('none')
    expect(warn).toHaveBeenCalledWith('IR code for "empty" is not defined')
    warn.mockRestore()
  })

  it('should unlock the remote when sending fails', async () => {
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    callService.mockRejectedValueOnce(new Error('offline'))
    render(<TestRemote />)
    fireEvent.click(screen.getByText('FIRST'))
    await flushLock(0)
    expect(screen.getByTestId('sending')).toHaveTextContent('none')
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })
})
