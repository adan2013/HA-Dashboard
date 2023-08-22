import EventEmitter from 'eventemitter3'
import {
  HomeAssistantConnectionState,
  EntityState,
  mapEntityState,
  MessageOptions,
  SocketMessageInterface,
  ListenerRemover,
  EntityListenerCallback,
  ConnectionStatusListenerCallback,
  getHomeAssistantHost,
  getHomeAssistantToken
} from './utils'
import WebSocketConnector from './WebSocketConnector'

class HomeAssistantWebSocketAPI extends WebSocketConnector {
  private readonly token: string
  private _status: HomeAssistantConnectionState = 'disconnected'
  private readonly events: EventEmitter

  msgId: number
  entities: EntityState[] = []

  public get status(): HomeAssistantConnectionState {
    return this._status
  }

  private changeStatus(status: HomeAssistantConnectionState) {
    this._status = status
    this.events?.emit('api-status', status)
  }

  private getEntity(entityName: string): EntityState {
    return this.entities.find(e => e.attributes.friendly_name === entityName)
  }

  subscribeToEntity(
    entityName: string,
    callback: EntityListenerCallback
  ): ListenerRemover {
    const currentState = this.getEntity(entityName)
    if (currentState) {
      const eventHandler = (state: EntityState) => {
        callback(state, this.status)
      }
      this.events.on(entityName, eventHandler)
      const unsubscribe = () => {
        this.events.off(entityName, eventHandler)
      }
      eventHandler(currentState)
      return unsubscribe
    }
    console.warn(
      `Failed to subscribe to the entity "${entityName}" - entity not found!`
    )
    return undefined
  }

  subscribeToConnectionState(
    callback: ConnectionStatusListenerCallback
  ): ListenerRemover {
    this.events.on('api-status', callback)
    const unsubscribe = () => {
      this.events.off('api-status', callback)
    }
    callback(this.status)
    return unsubscribe
  }

  public callService(
    entityId: string,
    domain: string,
    service: string,
    data: object = {}
  ) {
    this.sendMsg(
      'call_service',
      {
        domain,
        service,
        service_data: data,
        target: {
          entity_id: entityId
        }
      },
      {
        resultCallback: resp => {
          if (!resp.success) {
            console.error(
              `Failed to call service ${domain}.${service} for entity ${entityId}!`
            )
          }
        }
      }
    )
  }

  private sendMsg(
    type: string,
    payload: object = {},
    options: Partial<MessageOptions> = {}
  ) {
    const msgOptions: MessageOptions = {
      includeId: true,
      resultCallback: null,
      eventCallback: null,
      ...options
    }
    const msg: SocketMessageInterface = {
      type,
      ...payload
    }
    if (msgOptions.includeId) {
      msg.id = this.msgId
      this.msgId += 1
    }
    if (msgOptions.resultCallback) {
      this.events.once(`result/${msg.id}`, msgOptions.resultCallback)
    }
    if (msgOptions.eventCallback) {
      this.events.on(`event/${msg.id}`, msgOptions.eventCallback)
    }
    this.send(msg)
  }

  override sendPingMessage() {
    this.sendMsg('ping')
  }

  private initializeAfterAuthentication() {
    this.sendMsg(
      'get_states',
      {},
      {
        resultCallback: resp => {
          this.entities = resp.result.map(mapEntityState)
          console.log(
            `entity states fetched successfully! Count: ${this.entities.length}`
          )
          this.changeStatus('synced')
        }
      }
    )
    this.sendMsg(
      'subscribe_events',
      { event_type: 'state_changed' },
      {
        resultCallback: () => {
          console.log('subscribed to state_changed event')
        },
        eventCallback: event => {
          const newState = event.data.new_state
          const changedEntityIndex = this.entities.findIndex(
            e => e.id === newState.entity_id
          )
          if (changedEntityIndex >= 0) {
            this.entities[changedEntityIndex] = mapEntityState(newState)
            this.events.emit(
              this.entities[changedEntityIndex].attributes.friendly_name,
              this.entities[changedEntityIndex]
            )
          } else {
            console.warn(
              `changed entity not found! ID: ${newState.attributes.friendly_name}`
            )
          }
        }
      }
    )
  }

  override onReceive(event: MessageEvent) {
    super.onReceive(event)
    const msg = JSON.parse(event.data)
    switch (msg.type) {
      case 'auth_required':
        this.sendMsg(
          'auth',
          { access_token: this.token },
          {
            includeId: false
          }
        )
        return
      case 'auth_invalid':
        this.changeStatus('authError')
        return
      case 'auth_ok':
        this.changeStatus('authorized')
        this.initializeAfterAuthentication()
        return
      case 'result':
        if (msg.success) {
          this.events.emit(`result/${msg.id}`, msg)
        } else {
          console.warn('result message not successful', msg.error)
        }
        break
      case 'event':
        this.events.emit(`event/${msg.id}`, msg.event)
        break
      case 'ping':
      case 'pong':
        break
      default:
        console.warn('unhandled event type called', msg)
    }
  }

  override onConnectionStateChange(state: boolean) {
    super.onConnectionStateChange(state)
    this.changeStatus(state ? 'connected' : 'disconnected')
  }

  constructor() {
    const host = getHomeAssistantHost()
    const token = getHomeAssistantToken()
    if (host === '' || token === '') {
      console.error(
        'Home Assistant VITE_HA_HOST and VITE_HA_TOKEN must be provided!'
      )
      return
    }
    super(`${host}/api/websocket`)
    this.changeStatus('disconnected')
    this.msgId = 1
    this.token = token
    this.events = new EventEmitter()
  }
}

export default HomeAssistantWebSocketAPI
