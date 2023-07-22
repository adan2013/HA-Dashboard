import {
  createContext,
  ReactElement,
  useContext,
  useState,
  useMemo
} from 'react'
import {
  CustomizationConfig,
  readCustomizationConfig,
  saveCustomizationConfig
} from './utils'
import { themes } from '../themes'
import { backgrounds } from '../backgrounds'

type ProviderProps = {
  children: ReactElement
}

export type GlobalContextType = {
  notifications: string[] // TODO change to custom type and move to different context
  settings: CustomizationConfig
  updateSettings: (settings: Partial<CustomizationConfig>) => void
}

const globalContext = createContext<GlobalContextType>(null)

export const useGlobalContext = () => useContext(globalContext)

export const useTheme = () => {
  const context = useGlobalContext()
  return themes.find(t => t.id === context.settings.theme)
}

export const useBackground = () => {
  const context = useGlobalContext()
  return backgrounds.find(bg => bg.id === context.settings.background)
}

export const GlobalContextProvider = ({ children }: ProviderProps) => {
  const [settings, setSettings] = useState<CustomizationConfig>(
    readCustomizationConfig()
  )

  const value = useMemo(
    () => ({
      notifications: [],
      settings,
      updateSettings: newSettings => {
        setSettings(current => {
          const updatedSettings = { ...current, ...newSettings }
          saveCustomizationConfig(updatedSettings)
          return updatedSettings
        })
      }
    }),
    [settings]
  )

  return (
    <globalContext.Provider value={value}>{children}</globalContext.Provider>
  )
}
