import {
  createContext,
  ReactElement,
  useContext,
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect
} from 'react'
import Modal from 'react-modal'
import {
  getModalStyles,
  ModalParams,
  ModalState,
  ModalType
} from './modalUtils'
import ConfirmationBody from '../components/modals/bodies/ConfirmationBody'
import LightControlBody from '../components/modals/bodies/LightControlBody'
import RadiatorControlBody from '../components/modals/bodies/RadiatorControlBody'
import HistoryChartBody from '../components/modals/bodies/HistoryChartBody'
import BatteryListBody from '../components/modals/bodies/BatteryListBody'
import ServiceStatusTableBody from '../components/modals/bodies/ServiceStatusTableBody'
import WeatherBody from '../components/modals/bodies/WeatherBody'
import CameraViewBody from '../components/modals/bodies/CameraViewBody'
import TriggerNotificationBody from '../components/modals/bodies/TriggerNotificationBody'
import CountdownResetBody from '../components/modals/bodies/CountdownResetBody'
import BackendLogsBody from '../components/modals/bodies/BackendLogsBody'
import TimeRangeScheduleBody from '../components/modals/bodies/TimeRangeScheduleBody'
import RadiatorScheduleBody from '../components/modals/bodies/RadiatorScheduleBody'

type ProviderProps = {
  children: ReactElement
}

export type ModalContextType = {
  state: ModalState
  openModal: (modalType: ModalType, params?: ModalParams) => void
  closeModal: () => void
  setDismissHandler: (handler: (() => void) | null) => void
}

// Modal.setAppElement('#root')

export const modalContext = createContext<ModalContextType>(null)

export const useModalContext = () => useContext(modalContext)

// Nested modal views can treat Escape/backdrop as Back or Discard.
export const useModalDismiss = (handler: () => void) => {
  const { setDismissHandler, state } = useModalContext()
  const latestHandler = useRef(handler)
  latestHandler.current = handler
  useEffect(() => {
    if (!state.isOpen) return undefined
    // A control becoming disabled can leave focus on <body>. Capture Escape
    // there as well, and prevent react-modal from dismissing the next view too.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      latestHandler.current()
    }
    setDismissHandler(() => latestHandler.current())
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      setDismissHandler(null)
    }
  }, [setDismissHandler, state.isOpen])
}

export const ModalContextProvider = ({ children }: ProviderProps) => {
  const dismissHandler = useRef<(() => void) | null>(null)
  const setDismissHandler = useCallback((handler: (() => void) | null) => {
    dismissHandler.current = handler
  }, [])
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    modalType: null,
    params: null
  })

  const value: ModalContextType = useMemo(
    () => ({
      state: modalState,
      openModal: (modalType: ModalType, params?: ModalParams) => {
        setModalState({
          isOpen: true,
          modalType,
          params
        })
      },
      closeModal: () => {
        setModalState(c => ({ ...c, isOpen: false }))
      },
      setDismissHandler
    }),
    [modalState, setDismissHandler]
  )

  const getModalWidth = () => {
    switch (modalState.modalType) {
      case 'radiatorSchedule':
        return '1100px'
      case 'confirmation':
      case 'countdownReset':
      case 'lightControl':
      case 'radiatorControl':
      case 'triggerNotification':
      case 'timeRangeSchedule':
        return '600px'
      default:
        return '90vw'
    }
  }

  const renderModalBody = () => {
    switch (modalState.modalType) {
      case 'lightControl':
        return <LightControlBody />
      case 'radiatorControl':
        return <RadiatorControlBody />
      case 'radiatorSchedule':
        return <RadiatorScheduleBody />
      case 'confirmation':
        return <ConfirmationBody />
      case 'countdownReset':
        return <CountdownResetBody />
      case 'historyChart':
        return <HistoryChartBody />
      case 'serviceStatus':
        return <ServiceStatusTableBody />
      case 'backendLogs':
        return <BackendLogsBody />
      case 'batteryList':
        return <BatteryListBody />
      case 'weather':
        return <WeatherBody />
      case 'cameraView':
        return <CameraViewBody />
      case 'triggerNotification':
        return <TriggerNotificationBody />
      case 'timeRangeSchedule':
        return <TimeRangeScheduleBody />
      default:
        return null
    }
  }

  return (
    <modalContext.Provider value={value}>
      <>
        {children}
        <Modal
          isOpen={modalState.isOpen}
          onRequestClose={() => {
            if (dismissHandler.current) dismissHandler.current()
            else value.closeModal()
          }}
          style={getModalStyles(getModalWidth())}
          closeTimeoutMS={300}
        >
          {renderModalBody()}
        </Modal>
      </>
    </modalContext.Provider>
  )
}
