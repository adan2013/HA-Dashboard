import { ReactElement } from 'react'

export const holdTest = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms)
  })

const TestWrapper = ({ children }: { children: ReactElement }) => (
  <div id="wrapper">{children}</div>
)

export default TestWrapper
