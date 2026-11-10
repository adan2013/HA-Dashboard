import { isDevEnv } from '../utils/viteUtils'

export interface WebSocketConnectionOptions {
  pingInterval?: number
  pongTimeout?: number
  reconnectInterval?: number
  autoConnect?: boolean
}

class WebSocketConnector {
  private _connected = false
  private pingInterval: number
  private pongTimeout: number
  private reconnectTimeout: number
  private socket?: WebSocket
  private reconnectEnabled = false
  private suspended = false

  readonly options: WebSocketConnectionOptions
  readonly host: string

  constructor(url: string, options?: WebSocketConnectionOptions) {
    this.options = {
      pingInterval: isDevEnv() ? 1000 * 40 : 1000 * 60 * 2,
      pongTimeout: 1000 * 10,
      reconnectInterval: 1000 * 3,
      ...options
    }
    this.host = `ws://${url}`
    if (this.options.autoConnect !== false) this.connect()
  }

  sendPingMessage() {
    this.send({ type: 'ping' })
  }

  disconnect() {
    this.reconnectEnabled = false
    this._connected = false
    if (this.socket) {
      const { socket } = this
      this.socket = undefined
      socket.onopen = null
      socket.onmessage = null
      socket.onclose = null
      socket.onerror = null
      socket.close()
    }
    window.clearInterval(this.pingInterval)
    window.clearTimeout(this.pongTimeout)
    window.clearTimeout(this.reconnectTimeout)
  }

  suspend() {
    if (this.suspended) return
    // Do not trust Safari's cached OPEN/synced state after background suspension.
    this.suspended = true
    this.disconnect()
    this.onConnectionStateChange(false)
  }

  // Returns true only for the first wake event in a sleep/wake cycle.
  resume(): boolean {
    if (!this.suspended) return false
    this.suspended = false
    this.connect()
    return true
  }

  reconnect() {
    this.disconnect()
    this.onConnectionStateChange(false)
    this.connect()
  }

  connect() {
    if (this.suspended) return
    if (
      this.socket?.readyState === WebSocket.OPEN ||
      this.socket?.readyState === WebSocket.CONNECTING
    ) {
      return
    }
    this.disconnect()
    this.reconnectEnabled = true
    const socket = new WebSocket(this.host)
    this.socket = socket
    // A retired socket may still have callbacks queued when the page resumes.
    socket.onmessage = e => {
      if (this.socket === socket) this.onReceive(e)
    }
    socket.onopen = () => {
      if (this.socket === socket) this.onConnectionStateChange(true)
    }
    socket.onclose = () => {
      if (this.socket === socket) this.onConnectionStateChange(false)
    }
    socket.onerror = err => {
      if (this.socket !== socket) return
      console.error('websocket error', err)
    }
  }

  onConnectionStateChange(state: boolean) {
    window.clearInterval(this.pingInterval)
    window.clearTimeout(this.pongTimeout)
    window.clearTimeout(this.reconnectTimeout)
    this._connected = state
    const { socket } = this
    if (state) {
      if (this.options.pingInterval && this.options.pongTimeout) {
        console.log(
          `PING interval set to ${this.options.pingInterval}ms | PONG timeout set to ${this.options.pongTimeout}ms`
        )
        this.pingInterval = window.setInterval(() => {
          if (!this._connected || this.socket !== socket) return
          this.sendPingMessage()
          this.pongTimeout = window.setTimeout(() => {
            if (this.socket !== socket) return
            console.warn('websocket PONG timeout!')
            socket?.close()
          }, this.options.pongTimeout)
        }, this.options.pingInterval)
      }
    }
    if (!state && this.reconnectEnabled && this.options.reconnectInterval) {
      console.warn(
        `websocket connection lost! Reconnecting in ${this.options.reconnectInterval}ms`
      )
      this.reconnectTimeout = window.setTimeout(() => {
        if (!this.reconnectEnabled || this.socket !== socket) return
        console.log('trying to reconnect...')
        this.connect()
      }, this.options.reconnectInterval)
    }
  }

  onReceive(event: MessageEvent) {
    const msg = JSON.parse(event.data)
    if (msg.type !== 'event' && isDevEnv()) {
      console.log('[WS]', msg)
    }
    if (msg.type === 'ping') {
      this.send({ type: 'pong' })
    }
    if (msg.type === 'pong') {
      window.clearTimeout(this.pongTimeout)
      window.clearTimeout(this.reconnectTimeout)
    }
  }

  send(msg: object) {
    if (!this._connected || this.socket?.readyState !== WebSocket.OPEN) {
      return
    }
    if (isDevEnv()) {
      console.log('[PC]', msg)
    }
    this.socket?.send(JSON.stringify(msg))
  }
}

export default WebSocketConnector
