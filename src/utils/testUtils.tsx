import { HomeAssistantEntityData } from '../api/hooks'
import { EntityAttributeInterface } from '../api/utils'

export const holdTest = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms)
  })

export const defineWindowWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    configurable: true,
    value: width,
    writable: true
  })
}

export const generateEntityHistory = (values: number[]) => [
  values.map(value => ({
    entity_id: 'entityId',
    state: value.toString(),
    attributes: {},
    last_changed: '2023-09-04T14:09:44.397128+00:00',
    last_updated: '2023-09-04T14:09:44.397128+00:00'
  }))
]

export const getMockedEntityState = (
  name: string,
  state: string,
  attributes: object = {}
): HomeAssistantEntityData => ({
  entityState: {
    id: `${name}_id`,
    state,
    lastChanged: '1234',
    lastUpdated: '5678',
    attributes: {
      friendly_name: name,
      ...attributes
    }
  },
  isUnavailable: false
})
