import { act, cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BackendWebSocketAPI from '../../api/BackendWebSocketAPI'
import Layout from '../Layout'

let mockBackend: BackendWebSocketAPI
jest.mock('../../contexts/BackendContext', () => ({
  useBackend: () => mockBackend
}))
jest.mock('../../contexts/ModalContext', () => ({
  useModalContext: () => ({ closeModal: () => undefined })
}))
jest.mock('../../utils/viteUtils', () => ({
  getBackendHost: () => '127.0.0.1:8008',
  isDevEnv: () => false
}))
jest.mock('../DesktopLayout', () => () => null)
jest.mock('../MobileLayout', () => () => null)

class MockWebSocket {
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  static readonly CLOSED = 3
  // eslint-disable-next-line no-use-before-define
  static instances: MockWebSocket[] = []

  readyState = MockWebSocket.CONNECTING
  readonly sent: Record<string, unknown>[] = []
  onopen: () => void
  onclose: () => void
  onmessage: (event: MessageEvent) => void
  onerror: (event: Event) => void

  constructor() {
    MockWebSocket.instances.push(this)
  }

  send(message: string) {
    if (this.readyState !== MockWebSocket.OPEN) throw new Error('Socket closed')
    this.sent.push(JSON.parse(message))
  }

  close() {
    this.readyState = MockWebSocket.CLOSED
    this.onclose?.()
  }

  receive(message: object) {
    this.onmessage?.({ data: JSON.stringify(message) } as MessageEvent)
  }

  sync() {
    this.readyState = MockWebSocket.OPEN
    this.onopen?.()
    this.receive({ type: 'auth_required' })
    this.receive({ type: 'auth_ok' })
    this.receive({ type: 'welcome', version: 'test' })
    this.receive({ type: 'homeAssistantStatus', status: 'synced' })
    this.receive({ type: 'dataUpdate', data: {} })
  }
}

const visibility = (hidden: boolean) => {
  Object.defineProperty(document, 'hidden', {
    configurable: true,
    value: hidden
  })
  document.dispatchEvent(new Event('visibilitychange'))
}

const pageShow = () => {
  const event = new Event('pageshow')
  Object.defineProperty(event, 'persisted', { value: true })
  window.dispatchEvent(event)
}

const renderLayout = () =>
  render(
    <MemoryRouter>
      <Layout />
    </MemoryRouter>
  )

describe('Connection lifecycle through Layout and the real backend API', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    window.localStorage.clear()
    delete window.fully
    visibility(false)
    MockWebSocket.instances = []
    Object.assign(global, { WebSocket: MockWebSocket })
    mockBackend = new BackendWebSocketAPI()
    mockBackend.login('test-token')
    MockWebSocket.instances[0].sync()
  })

  afterEach(() => {
    cleanup()
    mockBackend.disconnect()
    delete window.fully
    jest.useRealTimers()
  })

  it.each(['Fully', 'browser'])(
    '%s: closes on sleep and opens only one fresh session on wake',
    mode => {
      if (mode === 'Fully') window.fully = { bind: jest.fn() }
      renderLayout()
      const oldSocket = MockWebSocket.instances[0]
      expect(screen.queryByText(/HA/)).toBeNull()

      act(() => {
        if (mode === 'Fully') window.onScreenOff()
        else visibility(true)
      })
      expect(oldSocket.readyState).toBe(MockWebSocket.CLOSED)
      expect(screen.queryByText(/HA/)).not.toBeNull()
      act(() => jest.advanceTimersByTime(300000))
      expect(MockWebSocket.instances).toHaveLength(1)

      act(() => {
        if (mode === 'Fully') window.onScreenOn()
        else visibility(false)
      })
      expect(MockWebSocket.instances).toHaveLength(2)

      // Another event must not interrupt the handshake, even after the old 500ms window.
      act(() => jest.advanceTimersByTime(700))
      act(() => visibility(false))
      expect(MockWebSocket.instances).toHaveLength(2)
      const newSocket = MockWebSocket.instances[1]
      act(() => newSocket.sync())
      expect(newSocket.sent).toContainEqual({
        type: 'auth',
        accessToken: 'test-token'
      })
      expect(newSocket.sent).toContainEqual({ type: 'syncData' })
      expect(screen.queryByText(/HA/)).toBeNull()

      // Nor may a delayed event restart an already synchronised session.
      act(() => jest.advanceTimersByTime(5000))
      act(() => {
        if (mode === 'Fully') window.onScreenOn()
        pageShow()
      })
      expect(MockWebSocket.instances).toHaveLength(2)
      expect(newSocket.readyState).toBe(MockWebSocket.OPEN)
      expect(screen.queryByText(/HA/)).toBeNull()

      // A genuinely new sleep/wake cycle must still open a new socket immediately.
      act(() => visibility(true))
      act(() => visibility(false))
      expect(MockWebSocket.instances).toHaveLength(3)
    }
  )

  it('handles pagehide/pageshow when Safari does not deliver visibilitychange', () => {
    renderLayout()
    act(() => window.dispatchEvent(new Event('pagehide')))
    expect(MockWebSocket.instances[0].readyState).toBe(MockWebSocket.CLOSED)
    act(() => pageShow())
    expect(MockWebSocket.instances).toHaveLength(2)
  })

  it('waits for visibility if Fully screenOn or pageshow arrives while still hidden', () => {
    window.fully = { bind: jest.fn() }
    renderLayout()
    act(() => {
      window.onScreenOff()
      visibility(true)
      window.dispatchEvent(new Event('pagehide'))
    })
    act(() => {
      window.onScreenOn()
      pageShow()
    })
    expect(MockWebSocket.instances).toHaveLength(1)
    act(() => visibility(false))
    expect(MockWebSocket.instances).toHaveLength(2)
  })

  it('suspends a page initially mounted in the background', () => {
    visibility(true)
    renderLayout()
    expect(MockWebSocket.instances[0].readyState).toBe(MockWebSocket.CLOSED)
    act(() => jest.advanceTimersByTime(300000))
    expect(MockWebSocket.instances).toHaveLength(1)
    act(() => visibility(false))
    expect(MockWebSocket.instances).toHaveLength(2)
  })

  it('cancels a pending reconnect while hidden and keeps automatic retry when visible', () => {
    renderLayout()
    act(() => MockWebSocket.instances[0].close())
    act(() => visibility(true))
    act(() => jest.advanceTimersByTime(10000))
    expect(MockWebSocket.instances).toHaveLength(1)
    act(() => visibility(false))
    expect(MockWebSocket.instances).toHaveLength(2)
    act(() => MockWebSocket.instances[1].sync())
    act(() => MockWebSocket.instances[1].close())
    act(() => jest.advanceTimersByTime(3000))
    expect(MockWebSocket.instances).toHaveLength(3)
  })

  it('cancels an outstanding pong timeout on sleep', () => {
    renderLayout()
    act(() => jest.advanceTimersByTime(120000))
    expect(MockWebSocket.instances[0].sent).toContainEqual({ type: 'ping' })
    act(() => visibility(true))
    act(() => visibility(false))
    act(() => MockWebSocket.instances[1].sync())
    act(() => jest.advanceTimersByTime(10000))
    expect(MockWebSocket.instances).toHaveLength(2)
    expect(MockWebSocket.instances[1].readyState).toBe(MockWebSocket.OPEN)
    expect(screen.queryByText(/HA/)).toBeNull()
  })

  it('ignores queued callbacks from the retired socket', () => {
    renderLayout()
    const oldSocket = MockWebSocket.instances[0]
    const { onmessage, onopen, onclose } = oldSocket
    act(() => visibility(true))
    act(() => visibility(false))
    const states: string[] = []
    const unsubscribe = mockBackend.subscribeToConnectionStatus(state =>
      states.push(state)
    )
    act(() => {
      onmessage({
        data: JSON.stringify({ type: 'dataUpdate', data: {} })
      } as MessageEvent)
      onopen()
      onclose()
    })
    expect(states).toEqual(['disconnected'])
    act(() => MockWebSocket.instances[1].sync())
    expect(screen.queryByText(/HA/)).toBeNull()
    unsubscribe()
  })
})
