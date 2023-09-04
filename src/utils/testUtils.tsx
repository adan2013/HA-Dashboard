export const holdTest = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms)
  })
