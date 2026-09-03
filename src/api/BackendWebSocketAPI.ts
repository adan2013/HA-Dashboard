import EventEmitter from 'eventemitter3'
import WebSocketConnector from './WebSocketConnector'
import { getBackendHost } from '../utils/viteUtils'
import {
  BackendAuthenticationState,
  BackendConnectionState,
  BackendConnectionStateListenerCallback,
  EntityListenerCallback,
  EntityState,
  HomeAssistantConnectionState,
  ListenerRemover,
  SensorHistoryItem,
  SocketMessageInterface
} from './utils'
import { ServiceDataObject, ServiceManagerStatus } from './backend/backendTypes'

const ACCESS_TOKEN_STORAGE_KEY = 'dashboardAccessToken'
const REQUEST_TIMEOUT = 15000

type PendingRequest = {
  resolve: (value: unknown) => void
  reject: (reason: Error) => void
  timeout: number
}

type EntitySubscription = {
  subscriptionId: string
  state?: EntityState
  listeners: Set<EntityListenerCallback>
}

class BackendWebSocketAPI extends WebSocketConnector {
  private readonly events = new EventEmitter()
  private readonly pendingRequests = new Map<string, PendingRequest>()
  private readonly entitySubscriptions = new Map<string, EntitySubscription>()
  private requestId = 1
  private accessToken: string
  private status: BackendConnectionState = 'disconnected'
  private authenticationState: BackendAuthenticationState
  private homeAssistantStatus: HomeAssistantConnectionState = 'disconnected'

  public version: string
  public statusData: ServiceManagerStatus = null
  public serviceData: ServiceDataObject = null

  private changeConnectionState(status: BackendConnectionState) {
    this.status = status
    this.events.emit('backend/status', status)
  }

  private changeAuthenticationState(status: BackendAuthenticationState) {
    this.authenticationState = status
    this.events.emit('backend/authentication', status)
  }

  private changeHomeAssistantStatus(status: HomeAssistantConnectionState) {
    this.homeAssistantStatus = status
    this.events.emit('ha/status', status)
    this.entitySubscriptions.forEach(subscription => {
      if (subscription.state) {
        subscription.listeners.forEach(listener =>
          listener(subscription.state, status)
        )
      }
    })
  }

  private static readStoredToken(): string {
    try {
      return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) || ''
    } catch {
      return ''
    }
  }

  private static storeToken(token: string) {
    try {
      window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
    } catch {
      console.warn('Unable to persist the dashboard access token')
    }
  }

  private static removeStoredToken() {
    try {
      window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    } catch {
      console.warn('Unable to remove the dashboard access token')
    }
  }

  public login(token: string) {
    const trimmedToken = token.trim()
    if (!trimmedToken) return
    this.accessToken = trimmedToken
    this.changeAuthenticationState('connecting')
    this.connect()
  }

  public logout() {
    BackendWebSocketAPI.removeStoredToken()
    this.accessToken = ''
    this.pendingRequests.forEach(({ reject, timeout }) => {
      window.clearTimeout(timeout)
      reject(new Error('Dashboard session ended'))
    })
    this.pendingRequests.clear()
    this.entitySubscriptions.clear()
    this.serviceData = null
    this.statusData = null
    this.disconnect()
    this.changeConnectionState('disconnected')
    this.changeHomeAssistantStatus('disconnected')
    this.changeAuthenticationState('missingToken')
  }

  public subscribeToAuthenticationState(
    callback: (state: BackendAuthenticationState) => void
  ): ListenerRemover {
    this.events.on('backend/authentication', callback)
    callback(this.authenticationState)
    return () => this.events.off('backend/authentication', callback)
  }

  public subscribeToStatusData(
    callback: (data: ServiceManagerStatus) => void
  ): ListenerRemover {
    this.events.on('backend/statusData', callback)
    callback(this.statusData)
    return () => this.events.off('backend/statusData', callback)
  }

  public subscribeToServiceData(
    callback: (data: ServiceDataObject) => void
  ): ListenerRemover {
    this.events.on('backend/serviceData', callback)
    callback(this.serviceData)
    return () => this.events.off('backend/serviceData', callback)
  }

  public subscribeToConnectionStatus(
    callback: BackendConnectionStateListenerCallback
  ): ListenerRemover {
    this.events.on('backend/status', callback)
    callback(this.status)
    return () => this.events.off('backend/status', callback)
  }

  public subscribeToHomeAssistantStatus(
    callback: (state: HomeAssistantConnectionState) => void
  ): ListenerRemover {
    this.events.on('ha/status', callback)
    callback(this.homeAssistantStatus)
    return () => this.events.off('ha/status', callback)
  }

  public subscribeToEntity(
    entityId: string,
    callback: EntityListenerCallback
  ): ListenerRemover {
    let subscription = this.entitySubscriptions.get(entityId)
    if (!subscription) {
      subscription = {
        subscriptionId: `entity:${entityId}`,
        listeners: new Set()
      }
      this.entitySubscriptions.set(entityId, subscription)
      if (this.authenticationState === 'authenticated') {
        this.sendEntitySubscription(entityId, subscription.subscriptionId)
      }
    }
    subscription.listeners.add(callback)
    if (subscription.state)
      callback(subscription.state, this.homeAssistantStatus)

    return () => {
      const currentSubscription = this.entitySubscriptions.get(entityId)
      currentSubscription?.listeners.delete(callback)
      if (currentSubscription?.listeners.size === 0) {
        this.sendMsg('unsubscribeEntity', {
          subscriptionId: currentSubscription.subscriptionId
        })
        this.entitySubscriptions.delete(entityId)
      }
    }
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

  public triggerRemoteControl(
    id: string,
    buttonNumber: number,
    buttonEvent: string
  ) {
    this.sendMsg('remoteControl', {
      id,
      value: `${buttonNumber}_${buttonEvent}`
    })
  }

  public switchService(serviceName: string, enabled: boolean) {
    this.sendMsg('switchService', { serviceName, enabled })
  }

  public callService(
    entityId: string | string[] | undefined,
    domain: string,
    service: string,
    data: object = {}
  ): Promise<unknown> {
    return this.request('callService', { entityId, domain, service, data })
  }

  public getSensorHistory(
    entityId: string,
    historyLength = 0
  ): Promise<SensorHistoryItem[]> {
    return this.request('getEntityHistory', {
      entityId,
      historyLength
    }) as Promise<SensorHistoryItem[]>
  }

  public getEntitiesWithAttribute(attribute: string): Promise<EntityState[]> {
    return this.request('getEntities', { attribute }) as Promise<EntityState[]>
  }

  private request(type: string, payload: object): Promise<unknown> {
    if (this.authenticationState !== 'authenticated') {
      const rejected = Promise.reject(
        new Error('Backend is not authenticated')
      ) as Promise<unknown>
      rejected.catch(error => console.error('Backend request failed', error))
      return rejected
    }
    const requestId = String(this.requestId++)
    const promise = new Promise<unknown>((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        this.pendingRequests.delete(requestId)
        reject(new Error('Backend request timed out'))
      }, REQUEST_TIMEOUT)
      this.pendingRequests.set(requestId, { resolve, reject, timeout })
      this.sendMsg(type, { requestId, ...payload })
    })
    promise.catch(error => console.error('Backend request failed', error))
    return promise
  }

  private sendEntitySubscription(entityId: string, subscriptionId: string) {
    this.sendMsg('subscribeEntity', { entityId, subscriptionId })
  }

  private restoreEntitySubscriptions() {
    this.entitySubscriptions.forEach((subscription, entityId) => {
      this.sendEntitySubscription(entityId, subscription.subscriptionId)
    })
  }

  private updateEntitySubscription(msg: {
    subscriptionId?: string
    data?: EntityState
  }) {
    const subscription = [...this.entitySubscriptions.values()].find(
      item => item.subscriptionId === msg.subscriptionId
    )
    if (!subscription || !msg.data) return
    subscription.state = msg.data
    subscription.listeners.forEach(listener =>
      listener(msg.data, this.homeAssistantStatus)
    )
  }

  private resolveRequest(msg: {
    requestId?: string
    success?: boolean
    result?: unknown
    data?: unknown
    error?: string
  }) {
    if (!msg.requestId) return
    const request = this.pendingRequests.get(msg.requestId)
    if (!request) return
    this.pendingRequests.delete(msg.requestId)
    window.clearTimeout(request.timeout)
    if (msg.success === false) {
      request.reject(new Error(msg.error || 'Backend request failed'))
    } else {
      request.resolve(msg.data ?? msg.result)
    }
  }

  private sendMsg(type: string, payload: object = {}) {
    const msg: SocketMessageInterface = { type, ...payload }
    this.send(msg)
  }

  override onConnectionStateChange(state: boolean) {
    super.onConnectionStateChange(state)
    this.changeConnectionState(state ? 'connected' : 'disconnected')
    if (!state && this.accessToken) this.changeAuthenticationState('connecting')
  }

  override onReceive(event: MessageEvent) {
    super.onReceive(event)
    const msg = JSON.parse(event.data)
    switch (msg.type) {
      case 'auth_required':
        if (this.accessToken) {
          this.sendMsg('auth', { accessToken: this.accessToken })
        }
        break
      case 'auth_ok':
        BackendWebSocketAPI.storeToken(this.accessToken)
        this.changeAuthenticationState('authenticated')
        this.restoreEntitySubscriptions()
        break
      case 'auth_invalid':
        BackendWebSocketAPI.removeStoredToken()
        this.accessToken = ''
        this.disconnect()
        this.changeConnectionState('disconnected')
        this.changeAuthenticationState('invalidToken')
        break
      case 'welcome':
        this.version = msg.version
        this.sendMsg('syncData')
        break
      case 'dataUpdate':
        this.changeConnectionState('synced')
        this.serviceData = { ...this.serviceData, ...msg.data }
        this.events.emit('backend/serviceData', this.serviceData)
        break
      case 'statusUpdate':
        this.statusData = msg.data
        this.events.emit('backend/statusData', this.statusData)
        break
      case 'homeAssistantStatus':
        this.changeHomeAssistantStatus(msg.status)
        break
      case 'entityState':
      case 'entityChanged':
        this.updateEntitySubscription(msg)
        break
      case 'subscriptionError':
        console.error('Entity subscription failed', msg.error)
        break
      case 'commandResult':
      case 'entityHistoryResult':
      case 'entitiesResult':
        this.resolveRequest(msg)
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
    super(host, { autoConnect: false })
    this.accessToken = BackendWebSocketAPI.readStoredToken()
    this.authenticationState = this.accessToken ? 'connecting' : 'missingToken'
    if (!host) {
      console.error('Backend host not provided')
      return
    }
    if (this.accessToken) this.connect()
  }
}

export default BackendWebSocketAPI
