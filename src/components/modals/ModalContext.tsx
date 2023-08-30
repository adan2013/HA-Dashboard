import {
  createContext,
  ReactElement,
  useContext,
  useState,
  useMemo
} from 'react'
import Modal from 'react-modal'
import { getModalStyles, ModalParams, ModalState, ModalType } from './utils'
import ConfirmationBody from './bodies/ConfirmationBody'
import LightControlBody from './bodies/LightControlBody'
import HistoryChartBody from './bodies/HistoryChartBody'
import ZigbeeNetworkBody from './bodies/ZigbeeNetworkBody'

type ProviderProps = {
  children: ReactElement
}

export type ModalContextType = {
  state: ModalState
  openModal: (modalType: ModalType, params?: ModalParams) => void
  closeModal: () => void
}

Modal.setAppElement('#root')

const modalContext = createContext<ModalContextType>(null)

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
      case 'zigbeeNetwork':
        return <ZigbeeNetworkBody />
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
