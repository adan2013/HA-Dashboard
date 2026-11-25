import { act, renderHook } from '@testing-library/react'
import { useServiceValue } from '../hooks'
import { useBackend } from '../../contexts/BackendContext'
import { ServiceManagerStatus } from '../backend/backendTypes'
import { BackendConnectionState, REQUEST_TIMEOUT_MS } from '../utils'

jest.mock('../../contexts/BackendContext', () => ({ useBackend: jest.fn() }))

const useBackendMock = useBackend as jest.Mock

const snapshot = (
  value: number | string | null,
  error: string | null = null
): ServiceManagerStatus => ({
  currentTime: '',
  startTime: '',
  daysRunning: 0,
  syncedEntitiesCount: 0,
  services: {
    test: {
      status: { color: 'green', message: 'Ready' },
      helpers: {
        'value/test': {
          color: error ? 'red' : 'green',
          message: error ?? String(value),
          value,
          updatedAt: '2026-11-23T03:00:00Z',
          error
        }
      }
    }
  }
})

describe('useServiceValue', () => {
  let statusListener: (data: ServiceManagerStatus) => void
  let connectionListener: (status: BackendConnectionState) => void
  const unsubscribe = jest.fn()
  const backend = {
    statusData: null,
    requestServiceStatus: jest.fn(),
    subscribeToStatusData: jest.fn(),
    subscribeToConnectionStatus: jest.fn()
  }

  beforeEach(() => {
    backend.statusData = null
    useBackendMock.mockReturnValue(backend)
    backend.subscribeToStatusData.mockImplementation(callback => {
      statusListener = callback
      callback(backend.statusData)
      return unsubscribe
    })
    backend.subscribeToConnectionStatus.mockImplementation(callback => {
      connectionListener = callback
      callback('synced')
      return unsubscribe
    })
  })

  it('loads the service list and reads a raw value without an HA connection', () => {
    const { result } = renderHook(() => useServiceValue<number>('test', 'test'))
    expect(result.current.isLoading).toBe(true)
    expect(backend.requestServiceStatus).toHaveBeenCalledTimes(1)
    act(() => statusListener(snapshot(0)))
    expect(result.current).toMatchObject({
      value: 0,
      isLoading: false,
      isUnavailable: false
    })
  })

  it('supports text values and selects the new helper when its name changes', () => {
    const { result, rerender } = renderHook(
      ({ name }) => useServiceValue<string>('test', name),
      { initialProps: { name: 'test' } }
    )
    act(() => statusListener(snapshot('1.0.0')))
    expect(result.current.value).toBe('1.0.0')
    rerender({ name: 'missing' })
    expect(result.current).toMatchObject({
      value: null,
      isLoading: false,
      isUnavailable: true
    })
  })

  it('keeps the last reading visible with its upstream error', () => {
    const { result } = renderHook(() => useServiceValue<number>('test', 'test'))
    act(() => statusListener(snapshot(21.37, 'Sendly balance request failed')))
    expect(result.current).toMatchObject({
      value: 21.37,
      error: 'Sendly balance request failed',
      isUnavailable: false
    })
    act(() => connectionListener('disconnected'))
    expect(result.current).toMatchObject({ value: null, isUnavailable: true })
  })

  it('treats missing helpers and unread values as unavailable instead of zero', () => {
    const { result } = renderHook(() => useServiceValue<number>('test', 'test'))
    act(() => statusListener(snapshot(null)))
    expect(result.current).toMatchObject({
      value: null,
      isLoading: false,
      isUnavailable: true
    })
  })

  it('stops loading after an unanswered service list request and unsubscribes', () => {
    jest.useFakeTimers()
    try {
      const { result, unmount } = renderHook(() =>
        useServiceValue<number>('test', 'test')
      )
      act(() => jest.advanceTimersByTime(REQUEST_TIMEOUT_MS))
      expect(result.current).toMatchObject({
        value: null,
        isLoading: false,
        error: 'Backend request timed out'
      })
      unmount()
      expect(unsubscribe).toHaveBeenCalled()
    } finally {
      jest.useRealTimers()
    }
  })
})
