import { useState, useEffect } from 'react'
import { Flip, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import MobileLayout from './MobileLayout'
import DesktopLayout from './DesktopLayout'
import 'react-toastify/dist/ReactToastify.css'
import { useBackendStatus, useHomeAssistantStatus } from '../api/hooks'
import { useHomeAssistant } from '../contexts/HomeAssistantContext'
import { useModalContext } from '../contexts/ModalContext'
import ConnectionStatusMessage from '../components/layout/ConnectionStatusMessage'
import { useBackend } from '../contexts/BackendContext'
import useMountEvent from '../hooks/useMountEvent'

type LayoutType = 'mobile' | 'desktop'
const MOBILE_LAYOUT_BREAKPOINT = 1024
const getLayoutType = (): LayoutType =>
  window.innerWidth < MOBILE_LAYOUT_BREAKPOINT ? 'mobile' : 'desktop'

const Layout = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutType>(getLayoutType())
  const statusHa = useHomeAssistantStatus()
  const statusBackend = useBackendStatus()
  const ha = useHomeAssistant()
  const backend = useBackend()
  const modal = useModalContext()
  const navigate = useNavigate()
  const isMobile = layoutMode === 'mobile'

  useEffect(() => {
    window.onScreenOn = () => {
      if (statusHa !== 'synced') {
        console.log('Force reconnecting to the Home Assistant')
        ha.connect()
      }
      if (statusBackend !== 'synced') {
        console.log('Force reconnecting to the Backend')
        backend.connect()
      }
    }
    window.onScreenOff = () => {
      modal.closeModal()
      navigate('/')
    }
  }, [navigate, statusHa, statusBackend, ha, backend, modal])

  useMountEvent(() => {
    if (Object.hasOwn(window, 'fully')) {
      console.log('Fully Kiosk detected! Enabling API integration')
      window.fully.bind('screenOn', 'onScreenOn();')
      window.fully.bind('screenOff', 'onScreenOff();')
    } else {
      console.log('Fully Kiosk not detected')
    }
    const onResize = () => setLayoutMode(getLayoutType())
    const onVisibilityChange = () => {
      if (document.hidden) {
        console.log('Browser tab is hidden')
      } else {
        console.log('Browser tab is visible')
        window.onScreenOn()
      }
    }
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('visibilitychange', onVisibilityChange)
    }
  })

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
      <ConnectionStatusMessage />
    </>
  )
}

export default Layout
