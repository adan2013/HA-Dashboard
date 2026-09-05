import { Styles } from 'react-modal'
import { ValueThreshold } from '../components/charts/utils'

export type ModalType =
  | 'confirmation'
  | 'countdownReset'
  | 'lightControl'
  | 'historyChart'
  | 'serviceStatus'
  | 'batteryList'
  | 'weather'
  | 'cameraView'
  | 'triggerNotification'

export type ConfirmationModalParams = {
  message?: string
  isDanger?: boolean
  onConfirm: () => void
}

export type CountdownResetModalParams = {
  title: string
  currentValue: string
  daysLeft: number
  onConfirm: (selectedDate: string) => Promise<void>
}

export type LightControlModalParams = {
  title: string
  entityId: string
  lockColorTemperature?: boolean
}

export type HistoryChartModalParams = {
  title: string
  entityId: string
  graphValueThresholds?: ValueThreshold[]
}

export type WeatherModalParams = {
  content: 'rain'
}

export type CameraViewModalParams = {
  entityId: string
  imageHost: string
}

export type ModalParams =
  | ConfirmationModalParams
  | CountdownResetModalParams
  | LightControlModalParams
  | HistoryChartModalParams
  | WeatherModalParams
  | CameraViewModalParams

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
