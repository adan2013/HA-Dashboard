import { useState, useEffect } from 'react'
import { Flip, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import MobileLayout from './MobileLayout'
import DesktopLayout from './DesktopLayout'
import 'react-toastify/dist/ReactToastify.css'
import { useHomeAssistantStatus } from '../api/hooks'
import { useHomeAssistant } from '../contexts/HomeAssistantContext'

type LayoutType = 'mobile' | 'desktop'
const MOBILE_LAYOUT_BREAKPOINT = 1024
const getLayoutType = (): LayoutType =>
  window.innerWidth < MOBILE_LAYOUT_BREAKPOINT ? 'mobile' : 'desktop'

const Layout = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutType>(getLayoutType())
  const status = useHomeAssistantStatus()
  const ha = useHomeAssistant()
  const navigate = useNavigate()
  const isMobile = layoutMode === 'mobile'

  useEffect(() => {
    window.onFullyScreenOn = () => {
      if (status !== 'authorized' && status !== 'synced') {
        ha.connect()
      }
    }
    window.onFullyScreenOff = () => {
      navigate('/')
    }
  }, [navigate, status, ha])

  useEffect(() => {
    if (Object.hasOwn(window, 'fully')) {
      console.log('Fully Kiosk detected! Enabling API integration')
      window.fully.bind('screenOn', 'onFullyScreenOn();')
      window.fully.bind('screenOff', 'onFullyScreenOff();')
    } else {
      console.log('Fully Kiosk not detected')
    }
    const onResize = () => setLayoutMode(getLayoutType())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
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
