import {
  createContext,
  ReactElement,
  useContext,
  useMemo,
  useEffect
} from 'react'
import HomeAssistantWebSocketAPI from '../ha/HomeAssistantWebSocketAPI'
import ConnectionStatusMessage from '../components/layout/ConnectionStatusMessage'

type ProviderProps = {
  children: ReactElement
}

const homeAssistantContext = createContext<HomeAssistantWebSocketAPI>(null)

export const useHomeAssistant = () => useContext(homeAssistantContext)

export const HomeAssistantContextProvider = ({ children }: ProviderProps) => {
  const ha = useMemo<HomeAssistantWebSocketAPI>(
    () => new HomeAssistantWebSocketAPI(),
    []
  )

  useEffect(() => {
    ha?.connect()
    return () => ha?.disconnect()
  }, [ha])

  return (
    <homeAssistantContext.Provider value={ha}>
      <ConnectionStatusMessage />
      {children}
    </homeAssistantContext.Provider>
  )
}
