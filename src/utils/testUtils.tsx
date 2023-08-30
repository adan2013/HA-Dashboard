import { ReactElement } from 'react'

const TestWrapper = ({ children }: { children: ReactElement }) => (
  <div id="wrapper">{children}</div>
)

export default TestWrapper
