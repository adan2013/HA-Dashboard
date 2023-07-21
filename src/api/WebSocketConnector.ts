import { getEnvVar } from './utils'

class WebSocketConnector {
  private _connected = false

  readonly host: string
  readonly socket: WebSocket

  public get connected(): boolean {
    return this._connected
  }

  constructor(url: string) {
    this.host = `ws://${url}`
    this.socket = new WebSocket(this.host)
    this.socket.onmessage = e => this.onReceive(e)
    this.socket.onopen = () => this.onConnectionStateChange(true)
    this.socket.onclose = () => this.onConnectionStateChange(false)
    this.socket.onerror = err => {
      console.error('websocket error', err)
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('closing the connection...')
      this.socket.close()
    }
  }

  onConnectionStateChange(state: boolean) {
    this._connected = state
  }

  onReceive(event: MessageEvent) {
    const msg = JSON.parse(event.data)
    if (getEnvVar('DEV')) {
      console.log('[WS]', msg)
    }
    if (msg.type === 'PING') {
      this.socket.send(JSON.stringify({ type: 'PONG' }))
    }
  }

  send(msg: object) {
    if (!this._connected) {
      return
    }
    if (getEnvVar('DEV')) {
      console.log('[PC]', msg)
    }
    this.socket.send(JSON.stringify(msg))
  }
}

export default WebSocketConnector
