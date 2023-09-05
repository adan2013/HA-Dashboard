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
