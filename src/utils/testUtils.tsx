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
