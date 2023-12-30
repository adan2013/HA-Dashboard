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
    action: ({ homeAssistant }) => {
      homeAssistant.callService(
        'input_select.washingmachinestate',
        'input_select',
        'select_option',
        {
          option: 'EMPTY'
        }
      )
    }
  }
]

export default actionConfig
