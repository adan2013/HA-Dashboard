import { createContext, ReactElement, useContext, useMemo } from 'react'
import { ActiveTheme } from '../themes'

type ProviderProps = {
  children: ReactElement
}

export type GlobalContextType = {
  theme: ActiveTheme
}

const globalContext = createContext<GlobalContextType>({
  theme: 'Blue'
})

export const useGlobalContext = () => useContext(globalContext)

export const GlobalContextProvider = ({ children }: ProviderProps) => {
  const value = useMemo<GlobalContextType>(
    () => ({
      theme: 'Blue'
    }),
    []
  )

  return (
    <globalContext.Provider value={value}>{children}</globalContext.Provider>
  )
}
