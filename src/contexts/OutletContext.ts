import { useOutletContext } from 'react-router-dom'

export type OutletContextType = { isMobile: boolean }

export const useLayoutContext = () => useOutletContext<OutletContextType>()
