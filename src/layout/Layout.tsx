import { useState, useEffect } from 'react'

import MobileLayout from './MobileLayout'
import DesktopLayout from './DesktopLayout'

type LayoutType = 'mobile' | 'desktop'
const MOBILE_LAYOUT_BREAKPOINT = 1024
const getLayoutType = (): LayoutType =>
  window.innerWidth < MOBILE_LAYOUT_BREAKPOINT ? 'mobile' : 'desktop'

const Layout = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutType>(getLayoutType())

  useEffect(() => {
    window.addEventListener('resize', () => setLayoutMode(getLayoutType()))
  }, [])

  if (layoutMode === 'mobile') {
    return <MobileLayout />
  }

  return <DesktopLayout />
}

export default Layout
