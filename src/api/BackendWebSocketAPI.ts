import EventEmitter from 'eventemitter3'
import WebSocketConnector from './WebSocketConnector'
import { getBackendHost } from '../utils/viteUtils'
import {
  BackendConnectionStatusListenerCallback,
  ListenerRemover,
  SocketMessageInterface
} from './utils'

class BackendWebSocketAPI extends WebSocketConnector {
  private readonly events: EventEmitter
  private connected = false
  public statusData: object = {}
  public serviceData: object = {}

  private setConnectedStatus(connected: boolean) {
    this.connected = connected
    this.events.emit('backend/status', connected)
  }

  subscribeToConnectionStatus(
    callback: BackendConnectionStatusListenerCallback
  ): ListenerRemover {
    this.events.on('backend/status', callback)
    const unsubscribe = () => {
      this.events.off('backend/status', callback)
    }
    callback(this.connected)
    return unsubscribe
  }

  private sendMsg(type: string, payload: object = {}) {
    const msg: SocketMessageInterface = {
      type,
      ...payload
    }
    this.send(msg)
  }

  override onReceive(event: MessageEvent) {
    super.onReceive(event)
    const msg = JSON.parse(event.data)
    switch (msg.type) {
      case 'welcome':
        this.setConnectedStatus(false)
        this.sendMsg('syncData')
        break
      case 'dataUpdate':
        if (!this.connected) {
          this.setConnectedStatus(true)
        }
        this.serviceData = {
          ...this.serviceData,
          ...msg.data
        }
        this.events.emit('backend/serviceData', this.serviceData)
        break
      case 'statusUpdate':
        this.statusData = msg.data
        this.events.emit('backend/statusData', this.statusData)
        break
      case 'ping':
      case 'pong':
        break
      default:
        console.warn('unhandled event type called', msg)
    }
  }

  constructor() {
    const host = getBackendHost()
    if (!host) {
      console.error('Backend host not provided')
      console.error('HOST', host)
      return
    }
    super(host)
    this.events = new EventEmitter()
  }
}

export default BackendWebSocketAPI
