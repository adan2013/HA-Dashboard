import { useMemo } from 'react'
import actionConfig from './actionConfig'
import { useModalContext } from '../../contexts/ModalContext'
import { NotificationActionContext } from './types'
import { useHomeAssistant } from '../../contexts/HomeAssistantContext'
import { useBackend } from '../../contexts/BackendContext'
import { ConfirmationModalParams } from '../../contexts/modalUtils'

type NotificationActionButtonProps = {
  id: string
}

const NotificationActionButton = ({ id }: NotificationActionButtonProps) => {
  const config = useMemo(() => actionConfig.find(a => a.id === id), [id])
  const haApi = useHomeAssistant()
  const backendApi = useBackend()
  const modal = useModalContext()

  if (!config) {
    return null
  }

  const onClick = () => {
    const actionCtx: NotificationActionContext = {
      homeAssistant: haApi,
      backend: backendApi
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
    <div
      className="mt-1 inline-block cursor-pointer rounded bg-gray-600 px-4 py-2 text-sm font-bold hover:bg-blue-800"
      onClick={onClick}
    >
      {config.text.toUpperCase()}
    </div>
  )
}

export default NotificationActionButton
