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
    window.onFullyScreenOn = () => {
      if (statusHa !== 'synced') {
        ha.connect()
      }
      if (statusBackend !== 'synced') {
        backend.connect()
      }
    }
    window.onFullyScreenOff = () => {
      modal.closeModal()
      navigate('/')
    }
  }, [navigate, statusHa, statusBackend, ha, backend, modal])

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
      <ConnectionStatusMessage />
    </>
  )
}

export default Layout
