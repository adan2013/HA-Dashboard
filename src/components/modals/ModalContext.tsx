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

  const closeModal = () => {
    setModalState(c => ({ ...c, isOpen: false }))
  }

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
      closeModal
    }),
    [modalState]
  )

  const getModalWidth = () => {
    switch (modalState.modalType) {
      case 'confirmation':
        return '400px'
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
          onRequestClose={closeModal}
          style={getModalStyles(getModalWidth())}
          closeTimeoutMS={300}
        >
          {renderModalBody()}
        </Modal>
      </>
    </modalContext.Provider>
  )
}
