import { useCallback } from 'react'
import useMultipleClickHoldLogic from './useMultipleClickHoldLogic'
import { useBackend } from '../contexts/BackendContext'

export type SupportedActions = {
  double: boolean
  triple: boolean
  hold: boolean
}

// eslint-disable-next-line no-shadow
enum RemoteAction {
  single = 'single',
  double = 'double',
  triple = 'triple',
  hold = 'hold'
}

const useRemoteControl = (
  entityId: string,
  btnNumber: number,
  supportedActions: SupportedActions
) => {
  const backend = useBackend()

  const trigger = useCallback(
    (action: RemoteAction) => {
      if (action !== RemoteAction.single && !supportedActions[action]) return
      backend.triggerRemoteControl(entityId, btnNumber, action)
    },
    [entityId, btnNumber, supportedActions, backend]
  )

  return useMultipleClickHoldLogic(
    count => {
      let action: RemoteAction = RemoteAction.single
      if (count === 2) action = RemoteAction.double
      if (count === 3) action = RemoteAction.triple
      trigger(action)
    },
    () => {
      trigger(RemoteAction.hold)
    },
    500
  )
}

export default useRemoteControl
