import { toast } from 'react-toastify'
import { NotificationAction } from './types'

const actionConfig: NotificationAction[] = [
  {
    id: 'deadlineWarning',
    text: 'Open alerts',
    action: ({ navigate }) => navigate('/section/alerts')
  },
  {
    id: 'waterLeak',
    text: 'Disable leak monitoring',
    confirmationRequired: true,
    confirmationMessage:
      'Disable water leak monitoring? This clears the current alarm and leaves water leak monitoring disabled until you turn it back on.',
    actionIsDanger: true,
    action: ({ backend }) => {
      backend
        .callService(
          'input_boolean.alertwaterleak',
          'input_boolean',
          'turn_off'
        )
        .then(() => {
          toast.success('Water leak monitoring disabled.')
        })
        .catch(error => {
          toast.error(
            error instanceof Error
              ? error.message
              : 'Unable to disable water leak monitoring.'
          )
        })
    }
  },
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
    text: 'Turn off',
    action: ({ backend }) => {
      backend.callService(
        'input_boolean.kitchenleftlighton',
        'input_boolean',
        'turn_off'
      )
      backend.callService(
        'input_boolean.kitchenrightlighton',
        'input_boolean',
        'turn_off'
      )
    }
  }
]

export default actionConfig
