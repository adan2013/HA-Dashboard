import { toast } from 'react-toastify'
import { NotificationAction } from './types'

const actionConfig: NotificationAction[] = [
  {
    id: 'test3',
    text: 'Example action',
    confirmationRequired: true,
    confirmationMessage: 'CUSTOM_CONFIRMATION_MESSAGE',
    actionIsDanger: true,
    action: () => {
      toast.success('Example action executed!')
    }
  },
  {
    id: 'loadedWashingMachine',
    text: 'Mark as done',
    confirmationRequired: true,
    action: ({ backend }) => {
      backend.dismissNotification('loadedWashingMachine')
    }
  },
  {
    id: 'manualKitchenLights',
    text: 'Switch to auto',
    action: ({ homeAssistant }) => {
      homeAssistant.callService(
        'input_boolean.kitchenleftlighton',
        'input_boolean',
        'turn_off'
      )
      homeAssistant.callService(
        'input_boolean.kitchenrightlighton',
        'input_boolean',
        'turn_off'
      )
    }
  }
]

export default actionConfig
