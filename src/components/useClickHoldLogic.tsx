import { useCallback, useRef, useState } from 'react'

const isTouchEvent = event => 'touches' in event

const preventDefault = event => {
  if (!isTouchEvent(event)) return

  if (event.touches.length < 2 && event.preventDefault) {
    event.preventDefault()
  }
}

export type ClickHoldLogicOptions = {
  disableInteractions?: boolean
  shouldPreventDefault?: boolean
  delay?: number
}

const useClickHoldLogic = (
  onClick: () => void,
  onLongPress: () => void,
  options: ClickHoldLogicOptions = {}
) => {
  const [holdTriggered, setHoldTriggered] = useState(false)
  const timeout = useRef<number>()
  const target = useRef<HTMLDivElement>()

  const {
    disableInteractions = false,
    shouldPreventDefault = true,
    delay = 800
  } = options

  const start = useCallback(
    event => {
      if (disableInteractions) return
      if (shouldPreventDefault && event.target) {
        event.target.addEventListener('touchend', preventDefault, {
          passive: false
        })
        target.current = event.target
      }
      timeout.current = window.setTimeout(() => {
        onLongPress()
        setHoldTriggered(true)
      }, delay)
    },
    [onLongPress, delay, shouldPreventDefault, disableInteractions]
  )

  const clear = useCallback(
    (event, shouldTriggerClick = true) => {
      if (disableInteractions) return
      if (timeout.current) clearTimeout(timeout.current)
      if (shouldTriggerClick && !holdTriggered) onClick()
      setHoldTriggered(false)
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault)
      }
    },
    [shouldPreventDefault, onClick, holdTriggered, disableInteractions]
  )

  return {
    onMouseDown: e => start(e),
    onTouchStart: e => start(e),
    onMouseUp: e => clear(e),
    onMouseLeave: e => clear(e, false),
    onTouchEnd: e => clear(e)
  }
}

export default useClickHoldLogic
