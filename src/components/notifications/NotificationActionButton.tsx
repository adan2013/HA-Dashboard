import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import actionConfig from './actionConfig'
import { useModalContext } from '../../contexts/ModalContext'
import { NotificationActionContext } from './types'
import { useBackend } from '../../contexts/BackendContext'
import { ConfirmationModalParams } from '../../contexts/modalUtils'

type NotificationActionButtonProps = {
  id: string
}

const NotificationActionButton = ({ id }: NotificationActionButtonProps) => {
  const config = useMemo(() => actionConfig.find(a => a.id === id), [id])
  const backendApi = useBackend()
  const navigate = useNavigate()
  const modal = useModalContext()

  if (!config) {
    return null
  }

  const onClick = () => {
    const actionCtx: NotificationActionContext = {
      backend: backendApi,
      navigate
    }
    if (config.confirmationRequired) {
      const modalParams: ConfirmationModalParams = {
        message: config.confirmationMessage,
        isDanger: config.actionIsDanger,
        onConfirm: () => config.action(actionCtx)
      }
      modal.openModal('confirmation', modalParams)
    } else {
      config.action(actionCtx)
    }
  }

  return (
    <button
      type="button"
      className="press-feedback mt-1 min-h-11 rounded bg-gray-600 px-4 py-2 text-sm font-bold hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      onClick={onClick}
      data-testid={`action-${id}`}
    >
      {config.text.toUpperCase()}
    </button>
  )
}

export default NotificationActionButton
