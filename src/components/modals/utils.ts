import { Styles } from 'react-modal'

export type ModalType = 'confirmation' | 'lightControl' | 'historyChart'

export type ConfirmationModalParams = {
  message?: string
  isDanger?: boolean
  onConfirm: () => void
}

export type LightControlModalParams = {
  title: string
  entityName: string
  lockColorTemperature?: boolean
}

export type HistoryChartModalParams = {
  title: string
  entityName: string
}

export type ModalParams =
  | ConfirmationModalParams
  | LightControlModalParams
  | HistoryChartModalParams

export type ModalState = {
  isOpen: boolean
  modalType: ModalType
  params?: ModalParams
}

export const getModalStyles = (size: string): Styles => ({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 100
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
    width: size,
    maxWidth: '90vw',
    minHeight: '200px',
    display: 'flex',
    position: 'relative',
    border: '4px solid #000',
    borderRadius: '12px',
    backgroundColor: '#000'
  }
})
