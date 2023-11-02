import { createContext, ReactElement, useContext } from 'react'
import ConnectionStatusMessage from '../components/layout/ConnectionStatusMessage'
import BackendWebSocketAPI from '../api/BackendWebSocketAPI'

type ProviderProps = {
  children: ReactElement
}

const backendContext = createContext<BackendWebSocketAPI>(null)

export const useBackend = () => useContext(backendContext)

const backend = new BackendWebSocketAPI()

export const BackendContextProvider = ({ children }: ProviderProps) => (
  <backendContext.Provider value={backend}>
    <ConnectionStatusMessage />
    {children}
  </backendContext.Provider>
)
