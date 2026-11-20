import { useCallback, useRef, useState } from 'react'
import { useBackend } from '../contexts/BackendContext'
import { triggerHapticFeedback } from '../utils/haptics'
import { IR_REMOTE_TOPIC } from '../components/specialTiles/irRemote/irRemoteCodes'

const MIN_LOCK_TIME = 500

const wait = (ms: number) =>
  new Promise(resolve => {
    window.setTimeout(resolve, ms)
  })

const useIrRemote = () => {
  const backend = useBackend()
  const isLocked = useRef(false)
  const [sendingButtonId, setSendingButtonId] = useState<string>()

  const send = useCallback(
    async (buttonId: string, code: string) => {
      if (isLocked.current) return
      if (!code) {
        // eslint-disable-next-line no-console
        console.warn(`IR code for "${buttonId}" is not defined`)
        return
      }

      isLocked.current = true
      setSendingButtonId(buttonId)
      triggerHapticFeedback('tap')
      try {
        await Promise.all([
          backend.callService(undefined, 'mqtt', 'publish', {
            topic: IR_REMOTE_TOPIC,
            payload: JSON.stringify({ ir_code_to_send: code })
          }),
          wait(MIN_LOCK_TIME)
        ])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Sending IR code for "${buttonId}" failed`, error)
      } finally {
        isLocked.current = false
        setSendingButtonId(undefined)
      }
    },
    [backend]
  )

  return { send, sendingButtonId }
}

export default useIrRemote
