import { useState, useEffect } from 'react'
import { Flip, ToastContainer } from 'react-toastify'
import MobileLayout from './MobileLayout'
import DesktopLayout from './DesktopLayout'
import 'react-toastify/dist/ReactToastify.css'

type LayoutType = 'mobile' | 'desktop'
const MOBILE_LAYOUT_BREAKPOINT = 1024
const getLayoutType = (): LayoutType =>
  window.innerWidth < MOBILE_LAYOUT_BREAKPOINT ? 'mobile' : 'desktop'

const Layout = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutType>(getLayoutType())
  const isMobile = layoutMode === 'mobile'

  useEffect(() => {
    window.addEventListener('resize', () => setLayoutMode(getLayoutType()))
  }, [])

  return (
    <>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      <ToastContainer
        position={isMobile ? 'top-center' : 'top-right'}
        autoClose={isMobile ? 3000 : 5000}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Flip}
        limit={isMobile ? 2 : 4}
      />
    </>
  )
}

export default Layout
