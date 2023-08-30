import { ReactElement } from 'react'
import { GlobalContextProvider } from '../contexts/GlobalContext'

const TestWrapper = ({ children }: { children: ReactElement }) => (
  <div id="root">
    <GlobalContextProvider>{children}</GlobalContextProvider>
  </div>
)

export default TestWrapper
