import {
  createContext,
  ReactElement,
  useContext,
  useState,
  useMemo
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
import HistoryChartBody from '../components/modals/bodies/HistoryChartBody'
import ZigbeeNetworkBody from '../components/modals/bodies/ZigbeeNetworkBody'
import ServiceStatusTableBody from '../components/modals/bodies/ServiceStatusTableBody'
import WeatherBody from '../components/modals/bodies/WeatherBody'
import CameraViewBody from '../components/modals/bodies/CameraViewBody'
import TriggerNotificationBody from '../components/modals/bodies/TriggerNotificationBody'

type ProviderProps = {
  children: ReactElement
}

export type ModalContextType = {
  state: ModalState
  openModal: (modalType: ModalType, params?: ModalParams) => void
  closeModal: () => void
}

// Modal.setAppElement('#root')

export const modalContext = createContext<ModalContextType>(null)

export const useModalContext = () => useContext(modalContext)

export const ModalContextProvider = ({ children }: ProviderProps) => {
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
      }
    }),
    [modalState]
  )

  const getModalWidth = () => {
    switch (modalState.modalType) {
      case 'confirmation':
      case 'lightControl':
      case 'triggerNotification':
        return '600px'
      default:
        return '90vw'
    }
  }

  const renderModalBody = () => {
    switch (modalState.modalType) {
      case 'lightControl':
        return <LightControlBody />
      case 'confirmation':
        return <ConfirmationBody />
      case 'historyChart':
        return <HistoryChartBody />
      case 'serviceStatus':
        return <ServiceStatusTableBody />
      case 'zigbeeNetwork':
        return <ZigbeeNetworkBody />
      case 'weather':
        return <WeatherBody />
      case 'cameraView':
        return <CameraViewBody />
      case 'triggerNotification':
        return <TriggerNotificationBody />
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
          onRequestClose={value.closeModal}
          style={getModalStyles(getModalWidth())}
          closeTimeoutMS={300}
        >
          {renderModalBody()}
        </Modal>
      </>
    </modalContext.Provider>
  )
}
