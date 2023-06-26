import { useOutletContext } from 'react-router-dom'

export type OutletContextType = { isMobile: boolean }

export const useUser = () => useOutletContext<OutletContextType>()
