import EventEmitter from 'eventemitter3'
import WebSocketConnector from './WebSocketConnector'
import { getBackendHost } from '../utils/viteUtils'
import {
  BackendConnectionState,
  BackendConnectionStateListenerCallback,
  ListenerRemover,
  SocketMessageInterface
} from './utils'
import { ServiceDataObject, ServiceManagerStatus } from './backend/backendTypes'

class BackendWebSocketAPI extends WebSocketConnector {
  private readonly events: EventEmitter
  public version: string
  private status: BackendConnectionState = 'disconnected'
  public statusData: ServiceManagerStatus = null
  public serviceData: ServiceDataObject = null

  private changeConnectionState(status: BackendConnectionState) {
    this.status = status
    this.events.emit('backend/status', status)
  }

  subscribeToStatusData(
    callback: (data: ServiceManagerStatus) => void
  ): ListenerRemover {
    this.events.on('backend/statusData', callback)
    const unsubscribe = () => {
      this.events.off('backend/statusData', callback)
    }
    callback(this.statusData)
    return unsubscribe
  }

  subscribeToServiceData(
    callback: (data: ServiceDataObject) => void
  ): ListenerRemover {
    this.events.on('backend/serviceData', callback)
    const unsubscribe = () => {
      this.events.off('backend/serviceData', callback)
    }
    callback(this.serviceData)
    return unsubscribe
  }

  subscribeToConnectionStatus(
    callback: BackendConnectionStateListenerCallback
  ): ListenerRemover {
    this.events.on('backend/status', callback)
    const unsubscribe = () => {
      this.events.off('backend/status', callback)
    }
    callback(this.status)
    return unsubscribe
  }

  private sendMsg(type: string, payload: object = {}) {
    const msg: SocketMessageInterface = {
      type,
      ...payload
    }
    this.send(msg)
  }

  public requestServiceStatus() {
    this.sendMsg('getStatus')
  }

  public triggerNotification(id: string) {
    this.sendMsg('triggerNotification', { notificationId: id })
  }

  public dismissNotification(id: string) {
    this.sendMsg('dismissNotification', { notificationId: id })
  }

  public switchService(serviceName: string, enabled: boolean) {
    this.sendMsg('switchService', { serviceName, enabled })
  }

  override onConnectionStateChange(state: boolean) {
    super.onConnectionStateChange(state)
    this.changeConnectionState(state ? 'connected' : 'disconnected')
  }

  override onReceive(event: MessageEvent) {
    super.onReceive(event)
    const msg = JSON.parse(event.data)
    switch (msg.type) {
      case 'welcome':
        this.version = msg.version
        this.changeConnectionState('connected')
        this.sendMsg('syncData')
        break
      case 'dataUpdate':
        if (this.status !== 'synced') {
          this.changeConnectionState('synced')
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
