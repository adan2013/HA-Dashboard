import { createContext, ReactElement, useContext, useMemo } from 'react'
import { ActiveTheme } from '../themes'

type ProviderProps = {
  children: ReactElement
}

export type GlobalContextType = {
  theme: ActiveTheme
  background: number
  notifications: string[] // TODO change to custom type
  sound?: boolean
}

const globalContext = createContext<GlobalContextType>({
  theme: 'Blue',
  background: 0,
  notifications: [],
  sound: false
})

export const useGlobalContext = () => useContext(globalContext)

export const GlobalContextProvider = ({ children }: ProviderProps) => {
  const value = useMemo<GlobalContextType>(
    () => ({
      theme: 'Blue',
      background: 0,
      notifications: ['1', '2', '3'],
      sound: false
    }),
    []
  )

  return (
    <globalContext.Provider value={value}>{children}</globalContext.Provider>
  )
}
