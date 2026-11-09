import { useState, useEffect, useRef } from 'react'
import { Flip, ToastContainer } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import MobileLayout from './MobileLayout'
import DesktopLayout from './DesktopLayout'
import 'react-toastify/dist/ReactToastify.css'
import { useModalContext } from '../contexts/ModalContext'
import ConnectionStatusMessage from '../components/layout/ConnectionStatusMessage'
import { useBackend } from '../contexts/BackendContext'

type LayoutType = 'mobile' | 'desktop'
const MOBILE_LAYOUT_BREAKPOINT = 1024
const RESUME_DEDUPLICATION_MS = 500
const getLayoutType = (): LayoutType =>
  window.innerWidth < MOBILE_LAYOUT_BREAKPOINT ? 'mobile' : 'desktop'

const Layout = () => {
  const [layoutMode, setLayoutMode] = useState<LayoutType>(getLayoutType())
  // Remount Home after tablet wake-up to reset widget scroll positions.
  const [contentKey, setContentKey] = useState(0)
  const lastResumeAt = useRef<number | null>(null)
  const backend = useBackend()
  const modal = useModalContext()
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = layoutMode === 'mobile'

  useEffect(() => {
    const onResize = () => setLayoutMode(getLayoutType())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    window.onScreenOn = () => {
      const now = performance.now()
      if (
        lastResumeAt.current !== null &&
        now - lastResumeAt.current < RESUME_DEDUPLICATION_MS
      ) {
        return
      }
      lastResumeAt.current = now
      if (location.pathname === '/') {
        setContentKey(currentKey => currentKey + 1)
      }
      // Safari can report the old socket as synced until after the resume event.
      console.log('Force reconnecting to the Backend')
      backend.reconnect()
    }
    window.onScreenOff = () => {
      lastResumeAt.current = null
      modal.closeModal()
      navigate('/')
    }
  }, [navigate, location.pathname, backend, modal])

  useEffect(() => {
    if (Object.hasOwn(window, 'fully')) {
      console.log('Fully Kiosk detected! Enabling API integration')
      window.fully.bind('screenOn', 'onScreenOn();')
      window.fully.bind('screenOff', 'onScreenOff();')
    } else {
      console.log('Fully Kiosk not detected')
    }
    const onVisibilityChange = () => {
      if (document.hidden) {
        lastResumeAt.current = null
        console.log('Browser tab is hidden')
      } else {
        console.log('Browser tab is visible')
        window.onScreenOn()
      }
    }
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log('Browser page restored from cache')
        window.onScreenOn()
      }
    }
    const onPageHide = () => {
      lastResumeAt.current = null
    }
    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return (
    <>
      {isMobile ? (
        <MobileLayout contentKey={contentKey} />
      ) : (
        <DesktopLayout contentKey={contentKey} />
      )}
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
