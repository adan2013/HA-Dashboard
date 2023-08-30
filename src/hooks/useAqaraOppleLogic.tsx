import { useCallback } from 'react'
import useMultipleClickHoldLogic from './useMultipleClickHoldLogic'
import { useHomeAssistant } from '../contexts/HomeAssistantContext'

const useAqaraOppleLogic = (rcName: string, btnNumber: number) => {
  const ha = useHomeAssistant()

  const callMqtt = useCallback(
    (action: string) => {
      ha.callService(undefined, 'mqtt', 'publish', {
        topic: `dashboard/rc/${rcName}`,
        payload: `button_${btnNumber}_${action}`
      })
    },
    [rcName, btnNumber, ha]
  )

  return useMultipleClickHoldLogic(
    count => {
      let action = 'single'
      if (count === 2) action = 'double'
      if (count === 3) action = 'triple'
      callMqtt(action)
    },
    () => {
      callMqtt('hold')
    },
    500
  )
}

export default useAqaraOppleLogic
