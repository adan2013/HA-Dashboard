import { createContext, ReactElement, useContext, useMemo } from 'react'
import { ActiveTheme } from '../themes'

type ProviderProps = {
  children: ReactElement
}

export type GlobalContextType = {
  theme: ActiveTheme
  notifications: string[] // TODO change to custom type
}

const globalContext = createContext<GlobalContextType>({
  theme: 'Blue',
  notifications: []
})

export const useGlobalContext = () => useContext(globalContext)

export const GlobalContextProvider = ({ children }: ProviderProps) => {
  const value = useMemo<GlobalContextType>(
    () => ({
      theme: 'Blue',
      notifications: ['1', '2', '3']
    }),
    []
  )

  return (
    <globalContext.Provider value={value}>{children}</globalContext.Provider>
  )
}
