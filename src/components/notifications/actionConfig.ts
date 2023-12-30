import { NotificationAction } from './types'

const actionConfig: NotificationAction[] = [
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
