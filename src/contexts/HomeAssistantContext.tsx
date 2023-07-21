import { createContext, ReactElement, useContext } from 'react'
import HomeAssistantWebSocketAPI from '../api/HomeAssistantWebSocketAPI'
import ConnectionStatusMessage from '../components/layout/ConnectionStatusMessage'

type ProviderProps = {
  children: ReactElement
}

const homeAssistantContext = createContext<HomeAssistantWebSocketAPI>(null)

export const useHomeAssistant = () => useContext(homeAssistantContext)

const ha = new HomeAssistantWebSocketAPI()

export const HomeAssistantContextProvider = ({ children }: ProviderProps) => (
  <homeAssistantContext.Provider value={ha}>
    <ConnectionStatusMessage />
    {children}
  </homeAssistantContext.Provider>
)
