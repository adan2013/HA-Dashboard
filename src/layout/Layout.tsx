import { useState, useEffect } from 'react'

import MobileLayout from './MobileLayout'

type LayoutType = 'mobile' | 'desktop'
const MOBILE_LAYOUT_BREAKPOINT = 1050
const getLayoutType = (): LayoutType =>
  window.innerWidth < MOBILE_LAYOUT_BREAKPOINT ? 'mobile' : 'desktop'

export default () => {
  const [layoutMode, setLayoutMode] = useState<LayoutType>(getLayoutType())

  useEffect(() => {
    window.addEventListener('resize', () => setLayoutMode(getLayoutType()))
  }, [])

  if (layoutMode === 'mobile') {
    return <MobileLayout />
  }

  return <div>DESKTOP LAYOUT WIP (TODO)</div>
}
