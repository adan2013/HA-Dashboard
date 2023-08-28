import { isDevEnv } from './utils'

export interface WebSocketConnectionOptions {
  pingInterval?: number
  pongTimeout?: number
  reconnectInterval?: number
}

class WebSocketConnector {
  private _connected = false
  private pingInterval: number
  private pongTimeout: number
  private reconnectTimeout: number
  private socket: WebSocket

  readonly options: WebSocketConnectionOptions
  readonly host: string

  constructor(url: string, options?: WebSocketConnectionOptions) {
    this.options = {
      pingInterval: isDevEnv() ? 1000 * 10 : 1000 * 60 * 2,
      pongTimeout: 1000 * 10,
      reconnectInterval: 1000 * 10,
      ...options
    }
    this.host = `ws://${url}`
    this.connect()
  }

  sendPingMessage() {
    this.socket.send(JSON.stringify({ type: 'ping' }))
  }

  disconnect() {
    this.socket?.close()
    window.clearInterval(this.pingInterval)
    window.clearTimeout(this.pongTimeout)
    window.clearTimeout(this.reconnectTimeout)
  }

  connect() {
    this.disconnect()
    this.socket = new WebSocket(this.host)
    this.socket.onmessage = e => this.onReceive(e)
    this.socket.onopen = () => this.onConnectionStateChange(true)
    this.socket.onclose = () => this.onConnectionStateChange(false)
    this.socket.onerror = err => {
      console.error('websocket error', err)
    }
  }

  onConnectionStateChange(state: boolean) {
    window.clearTimeout(this.reconnectTimeout)
    this._connected = state
    if (state) {
      if (this.options.pingInterval && this.options.pongTimeout) {
        console.log(
          `PING interval set to ${this.options.pingInterval}ms | PONG timeout set to ${this.options.pongTimeout}ms`
        )
        this.pingInterval = window.setInterval(() => {
          if (!this._connected) return
          this.sendPingMessage()
          this.pongTimeout = window.setTimeout(() => {
            console.warn('websocket PONG timeout!')
            this.disconnect()
            this.onConnectionStateChange(false)
          }, this.options.pongTimeout)
        }, this.options.pingInterval)
      }
    }
    if (!state && this.options.reconnectInterval) {
      console.warn(
        `websocket connection lost! Reconnecting in ${this.options.reconnectInterval}ms`
      )
      this.reconnectTimeout = window.setTimeout(() => {
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
      this.socket.send(JSON.stringify({ type: 'pong' }))
    }
    if (msg.type === 'pong') {
      window.clearTimeout(this.pongTimeout)
      window.clearTimeout(this.reconnectTimeout)
    }
  }

  send(msg: object) {
    if (!this._connected) {
      return
    }
    if (isDevEnv()) {
      console.log('[PC]', msg)
    }
    this.socket.send(JSON.stringify(msg))
  }
}

export default WebSocketConnector
