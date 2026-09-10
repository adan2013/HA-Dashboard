import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { useBackendStatus, useHomeAssistantStatus } from '../api/hooks'

type ProviderProps = {
  children: ReactElement
  waitForConnection?: boolean
}

export type TileConnectionContextType = {
  isLoading: boolean
  isHomeAssistantUnavailable: boolean
  setTileLoading?: (id: string, isLoading: boolean) => void
}

const tileConnectionContext = createContext<TileConnectionContextType>({
  isLoading: false,
  isHomeAssistantUnavailable: false
})

export const useTileConnection = () => useContext(tileConnectionContext)

export const TileConnectionContextProvider = ({
  children,
  waitForConnection = true
}: ProviderProps) => {
  const haStatus = useHomeAssistantStatus()
  const backendStatus = useBackendStatus()
  const [initialized, setInitialized] = useState(false)
  const [loadingTiles, setLoadingTiles] = useState<Set<string>>(() => new Set())

  useEffect(() => setInitialized(true), [])

  const setTileLoading = useCallback((id: string, isLoading: boolean) => {
    setLoadingTiles(current => {
      if (current.has(id) === isLoading) return current
      const next = new Set(current)
      if (isLoading) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  // An HA outage must not keep backend diagnostics behind pending HA tiles.
  const waitForTiles = haStatus !== 'disconnected' && haStatus !== 'authError'

  const value: TileConnectionContextType = useMemo(
    () => ({
      isLoading:
        waitForConnection &&
        (!initialized ||
          backendStatus !== 'synced' ||
          (waitForTiles && loadingTiles.size > 0)),
      isHomeAssistantUnavailable:
        backendStatus !== 'synced' || haStatus !== 'synced',
      setTileLoading
    }),
    [
      waitForConnection,
      backendStatus,
      haStatus,
      initialized,
      waitForTiles,
      loadingTiles,
      setTileLoading
    ]
  )

  return (
    <tileConnectionContext.Provider value={value}>
      {children}
    </tileConnectionContext.Provider>
  )
}
