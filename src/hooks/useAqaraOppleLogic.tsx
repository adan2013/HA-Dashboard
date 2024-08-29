import { useCallback } from 'react'
import useMultipleClickHoldLogic from './useMultipleClickHoldLogic'
import { useBackend } from '../contexts/BackendContext'

const useAqaraOppleLogic = (entityId: string, btnNumber: number) => {
  const backend = useBackend()

  const trigger = useCallback(
    (action: string) => {
      backend.triggerRemoteControl(entityId, `button_${btnNumber}_${action}`)
    },
    [entityId, btnNumber, backend]
  )

  return useMultipleClickHoldLogic(
    count => {
      let action = 'single'
      if (count === 2) action = 'double'
      if (count === 3) action = 'triple'
      trigger(action)
    },
    () => {
      trigger('hold')
    },
    500
  )
}

export default useAqaraOppleLogic
