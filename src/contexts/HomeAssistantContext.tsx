import {
  createContext,
  ReactElement,
  useContext,
  useMemo,
  useEffect
} from 'react'
import clsx from 'clsx'
import HomeAssistantWebSocketAPI from '../ha/HomeAssistantWebSocketAPI'

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
      <div className="fixed right-1/2 top-0 translate-x-1/2 rounded-b-lg bg-black px-3 py-2 text-white">
        <div
          className={clsx(
            'mr-1 inline-block h-3 w-3 animate-pulse rounded-full',
            'bg-red-600'
          )}
        />
        Disconnected
      </div>
      {children}
    </homeAssistantContext.Provider>
  )
}
