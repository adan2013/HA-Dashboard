import {
  ConnectionStatus,
  EntityState,
  getEnvVar,
  mapEntityState,
  MessageOptions,
  SocketListener,
  SocketMessageInterface,
  ListenerRemover,
  UpdateListener,
  UpdateListenerCallback
} from './utils'

class HomeAssistantWebSocketAPI {
  private socket: WebSocket
  private token: string
  private _status: ConnectionStatus = 'disconnected'

  host: string
  msgId: number
  resultListeners: SocketListener[] = []
  eventListeners: SocketListener[] = []
  updateListeners: UpdateListener[] = []
  entities: EntityState[] = []

  public get status(): ConnectionStatus {
    return this._status
  }

  public set status(status: ConnectionStatus) {
    this._status = status
    this.emitConnectionStatusUpdate(status)
  }

  private subscribe(
    id: string,
    callback: UpdateListenerCallback
  ): ListenerRemover {
    this.updateListeners.push({ id, callback })
    return () => {
      this.updateListeners = this.updateListeners.filter(
        l => l.callback !== callback
      )
    }
  }

  subscribeToEntity(
    entityId: string,
    callback: UpdateListenerCallback
  ): ListenerRemover {
    const unsubscribe = this.subscribe(entityId, callback)
    const currentState = this.entities.find(e => e.id === entityId)
    callback(currentState, this.status)
    return unsubscribe
  }

  subscribeToStatus(callback: UpdateListenerCallback): ListenerRemover {
    const unsubscribe = this.subscribe('connectionStatus', callback)
    callback(null, this.status)
    return unsubscribe
  }

  private emitEntityUpdate(entityId: string, state: EntityState) {
    const listeners = this.updateListeners.filter(l => l.id === entityId)
    listeners.forEach(l => l.callback(state, this.status))
  }

  private emitConnectionStatusUpdate(status: ConnectionStatus) {
    const listeners = this.updateListeners.filter(
      l => l.id === 'connectionStatus'
    )
    listeners.forEach(l => l.callback(null, status))
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
      this.resultListeners.push({
        msgId: msg.id,
        callback: msgOptions.resultCallback
      })
    }
    if (msgOptions.eventCallback) {
      this.eventListeners.push({
        msgId: msg.id,
        callback: msgOptions.eventCallback
      })
    }
    if (getEnvVar('DEV')) {
      console.log('[PC]', msg)
    }
    this.socket.send(JSON.stringify(msg))
  }

  private initializeAfterAuthentication() {
    this.sendMsg(
      'get_states',
      {},
      {
        resultCallback: result => {
          this.entities = result.map(mapEntityState)
          console.log(
            `entity states fetched successfully! Count: ${this.entities.length}`
          )
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
            this.emitEntityUpdate(
              this.entities[changedEntityIndex].id,
              this.entities[changedEntityIndex]
            )
          } else {
            console.warn(`changed entity not found! ID: ${newState.entity_id}`)
          }
        }
      }
    )
  }

  private onReceive(event: MessageEvent) {
    const msg = JSON.parse(event.data)
    if (getEnvVar('DEV')) {
      console.log('[HA]', msg)
    }
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
        this.status = 'authError'
        return
      case 'auth_ok':
        this.status = 'authorized'
        this.initializeAfterAuthentication()
        return
      case 'result':
        if (msg.success) {
          const resultListener = this.resultListeners.find(
            l => l.msgId === msg.id
          )
          if (resultListener) {
            resultListener.callback(msg.result)
            this.resultListeners = this.resultListeners.filter(
              l => l.msgId !== msg.id
            )
          } else {
            console.warn(`no result listener found for ID: ${msg.id}`)
          }
        } else {
          console.warn('result message not successful', msg.error)
        }
        break
      case 'event':
        {
          const eventListener = this.eventListeners.find(
            l => l.msgId === msg.id
          )
          if (eventListener) {
            eventListener.callback(msg.event)
          } else {
            console.warn(`no event listener found for ID: ${msg.id}`)
          }
        }
        break
      default:
        console.warn('unhandled event type called', msg)
    }
  }

  connect() {
    this.status = 'disconnected'
    this.msgId = 1
    this.host = getEnvVar('VITE_HA_HOST')
    this.token = getEnvVar('VITE_HA_TOKEN')
    if (this.host === '' || this.token === '') {
      console.error(
        'Home Assistant VITE_HA_HOST and VITE_HA_TOKEN must be provided!'
      )
      return
    }
    console.log('connecting to host', this.host)
    this.socket = new WebSocket(`ws://${this.host}/api/websocket`)
    this.socket.onmessage = e => this.onReceive(e)
    this.socket.onopen = () => {
      this.status = 'connected'
    }
    this.socket.onclose = () => {
      this.status = 'disconnected'
    }
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
}

export default HomeAssistantWebSocketAPI
