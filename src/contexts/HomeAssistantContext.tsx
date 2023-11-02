import { createContext, ReactElement, useContext } from 'react'
import HomeAssistantWebSocketAPI from '../api/HomeAssistantWebSocketAPI'

type ProviderProps = {
  children: ReactElement
}

const homeAssistantContext = createContext<HomeAssistantWebSocketAPI>(null)

export const useHomeAssistant = () => useContext(homeAssistantContext)

const ha = new HomeAssistantWebSocketAPI()

export const HomeAssistantContextProvider = ({ children }: ProviderProps) => (
  <homeAssistantContext.Provider value={ha}>
    {children}
  </homeAssistantContext.Provider>
)
