interface SocketMessageInterface {
  type: string
  id?: number
}

interface EntityAttributeInterface {
  friendly_name: string
}

type MessageOptions = {
  includeId: boolean
  resultCallback: (result: any) => void
  eventCallback: (event: any) => void
}

type SocketListener = {
  msgId: number
  callback?: (callbackData: any) => void
}

type EntityState = {
  id: string
  state: string
  lastChanged: string
  lastUpdated: string
  attributes: EntityAttributeInterface
}

export type ConnectionStatus =
  | 'authorized'
  | 'connected'
  | 'disconnected'
  | 'authError'

const getEnvVar = (name: string): string =>
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  import.meta.env[name] || ''

class HomeAssistantWebSocketAPI {
  private socket: WebSocket
  private token: string

  host: string
  status: ConnectionStatus = 'disconnected'
  resultListeners: SocketListener[] = []
  eventListeners: SocketListener[] = []
  msgId: number

  entities: EntityState[] = []

  sendMsg(
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

  initializeAfterAuthentication() {
    this.sendMsg(
      'get_states',
      {},
      {
        resultCallback: result => {
          this.entities = result.map(
            (entity): EntityState => ({
              id: entity.entity_id,
              state: entity.state,
              lastChanged: entity.last_changed,
              lastUpdated: entity.last_updated,
              attributes: entity.attributes
            })
          )
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
          const changedEntity = this.entities.find(
            e => e.id === newState.entity_id
          )
          if (changedEntity) {
            changedEntity.id = newState.entity_id
            changedEntity.state = newState.state
            changedEntity.lastChanged = newState.last_changed
            changedEntity.lastUpdated = newState.last_updated
            changedEntity.attributes = newState.attributes
          } else {
            console.warn(`changed entity not found! ID: ${newState.entity_id}`)
          }
        }
      }
    )
  }

  onReceive(event: MessageEvent) {
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
