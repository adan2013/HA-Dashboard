import BackendWebSocketAPI from '../BackendWebSocketAPI'

jest.mock('../../utils/viteUtils', () => ({
  getBackendHost: () => '127.0.0.1:8008',
  isDevEnv: () => false
}))

class MockWebSocket {
  static readonly CONNECTING = 0
  static readonly OPEN = 1
  // The mock registry intentionally contains instances of the class being defined.
  // eslint-disable-next-line no-use-before-define
  static instances: MockWebSocket[] = []

  readonly sent: Record<string, unknown>[] = []
  readyState = MockWebSocket.CONNECTING
  onmessage: (event: MessageEvent) => void
  onopen: () => void
  onclose: () => void
  onerror: (event: Event) => void

  constructor(readonly url: string) {
    MockWebSocket.instances.push(this)
  }

  send(message: string) {
    this.sent.push(JSON.parse(message))
  }

  close() {
    this.readyState = MockWebSocket.CONNECTING
  }

  open() {
    this.readyState = MockWebSocket.OPEN
    this.onopen?.()
  }

  receive(message: object) {
    this.onmessage?.({ data: JSON.stringify(message) } as MessageEvent)
  }
}

const authenticate = (backend: BackendWebSocketAPI) => {
  backend.login('dashboard-token')
  const socket = MockWebSocket.instances.at(-1)
  socket.open()
  socket.receive({ type: 'auth_required' })
  socket.receive({ type: 'auth_ok' })
  return socket
}

describe('BackendWebSocketAPI', () => {
  beforeEach(() => {
    window.localStorage.clear()
    MockWebSocket.instances = []
    Object.assign(global, { WebSocket: MockWebSocket })
  })

  it('should notify entity subscribers when a subscription fails', () => {
    const backend = new BackendWebSocketAPI()
    const socket = authenticate(backend)
    const listener = jest.fn()
    backend.subscribeToEntity('light.missing', listener)
    socket.receive({
      type: 'subscriptionError',
      subscriptionId: 'entity:light.missing',
      error: 'Entity not found'
    })
    expect(listener).toHaveBeenCalledWith(null, 'disconnected')
    const secondListener = jest.fn()
    backend.subscribeToEntity('light.missing', secondListener)
    expect(secondListener).toHaveBeenCalledWith(null, 'disconnected')
  })

  it('should authenticate with the first protocol message and store a valid token', () => {
    const backend = new BackendWebSocketAPI()
    const socket = authenticate(backend)

    expect(socket.sent).toContainEqual({
      type: 'auth',
      accessToken: 'dashboard-token'
    })
    expect(window.localStorage.getItem('dashboardAccessToken')).toBe(
      'dashboard-token'
    )
  })

  it('should deduplicate entity subscriptions and release the last subscriber', () => {
    const backend = new BackendWebSocketAPI()
    const socket = authenticate(backend)
    const firstListener = jest.fn()
    const secondListener = jest.fn()

    const unsubscribeFirst = backend.subscribeToEntity(
      'light.kitchen',
      firstListener
    )
    const unsubscribeSecond = backend.subscribeToEntity(
      'light.kitchen',
      secondListener
    )
    expect(
      socket.sent.filter(message => message.type === 'subscribeEntity')
    ).toHaveLength(1)

    socket.receive({
      type: 'entityState',
      subscriptionId: 'entity:light.kitchen',
      data: {
        id: 'light.kitchen',
        state: 'on',
        lastChanged: '',
        lastUpdated: '',
        attributes: { friendly_name: 'Kitchen' }
      }
    })
    expect(firstListener).toHaveBeenCalledTimes(1)
    expect(secondListener).toHaveBeenCalledTimes(1)

    unsubscribeFirst()
    expect(
      socket.sent.filter(message => message.type === 'unsubscribeEntity')
    ).toHaveLength(0)
    unsubscribeSecond()
    expect(socket.sent).toContainEqual({
      type: 'unsubscribeEntity',
      subscriptionId: 'entity:light.kitchen'
    })
  })

  it('should resolve command confirmations and reject backend errors', async () => {
    const backend = new BackendWebSocketAPI()
    const socket = authenticate(backend)

    const success = backend.callService('light.kitchen', 'light', 'turn_on')
    const successMessage = socket.sent.at(-1)
    socket.receive({
      type: 'commandResult',
      requestId: successMessage.requestId,
      success: true,
      result: { accepted: true }
    })
    await expect(success).resolves.toEqual({ accepted: true })

    const failure = backend.callService('light.kitchen', 'light', 'turn_off')
    const failureMessage = socket.sent.at(-1)
    socket.receive({
      type: 'commandResult',
      requestId: failureMessage.requestId,
      success: false,
      error: 'HA rejected the command'
    })
    await expect(failure).rejects.toThrow('HA rejected the command')
  })

  it('should request and receive dedicated battery entities', async () => {
    const backend = new BackendWebSocketAPI()
    const socket = authenticate(backend)
    const batteryEntity = {
      id: 'sensor.kitchen_remote_battery',
      state: '64',
      lastChanged: '',
      lastUpdated: '',
      attributes: { friendly_name: 'Kitchen remote Battery' }
    }

    const request = backend.getBatteryEntities()
    const requestMessage = socket.sent.at(-1)
    expect(requestMessage).toMatchObject({ type: 'getBatteryEntities' })

    socket.receive({
      type: 'batteryEntitiesResult',
      requestId: requestMessage.requestId,
      data: [batteryEntity]
    })

    await expect(request).resolves.toEqual([batteryEntity])
  })

  it('should request and receive the latest backend logs', async () => {
    const backend = new BackendWebSocketAPI()
    const socket = authenticate(backend)
    const logEntry = {
      time: '2026-09-07T10:00:00.000Z',
      level: 'error',
      scope: 'WeatherService',
      message: 'Weather refresh failed'
    }

    const request = backend.getBackendLogs()
    const requestMessage = socket.sent.at(-1)
    expect(requestMessage).toMatchObject({ type: 'getBackendLogs' })

    socket.receive({
      type: 'backendLogsResult',
      requestId: requestMessage.requestId,
      data: [logEntry]
    })

    await expect(request).resolves.toEqual([logEntry])
  })

  it('should time out requests after ten seconds', async () => {
    jest.useFakeTimers()
    try {
      const backend = new BackendWebSocketAPI()
      authenticate(backend)
      const onFailure = jest.fn()
      const requests = [
        backend.getSensorHistory('sensor.temperature'),
        backend.getBatteryEntities(),
        backend.getBackendLogs()
      ].map(request => request.catch(onFailure))

      jest.advanceTimersByTime(9999)
      await Promise.resolve()
      expect(onFailure).not.toHaveBeenCalled()
      jest.advanceTimersByTime(1)
      await Promise.all(requests)
      expect(onFailure).toHaveBeenCalledTimes(3)
      expect(onFailure).toHaveBeenCalledWith(
        new Error('Backend request timed out')
      )
    } finally {
      jest.useRealTimers()
    }
  })

  it('should clear the persisted token on logout', () => {
    const backend = new BackendWebSocketAPI()
    authenticate(backend)
    backend.logout()
    expect(window.localStorage.getItem('dashboardAccessToken')).toBeNull()
  })

  it('should open a fresh socket when reconnect is forced', () => {
    const backend = new BackendWebSocketAPI()
    authenticate(backend)

    backend.reconnect()

    expect(MockWebSocket.instances).toHaveLength(2)
  })
})
