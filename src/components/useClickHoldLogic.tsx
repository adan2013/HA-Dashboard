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

type MouseCoordinates = {
  x: number
  y: number
}

const MOVEMENT_THRESHOLD = 10
const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel']
const mouseEvents = [
  'mousedown',
  'mouseup',
  'mousemove',
  'mouseover',
  'mouseout',
  'mouseenter',
  'mouseleave'
]

const useClickHoldLogic = (
  onClick: () => void,
  onLongPress: () => void,
  options: ClickHoldLogicOptions = {}
) => {
  const [holdTriggered, setHoldTriggered] = useState(false)
  const timeout = useRef<number>()
  const target = useRef<HTMLDivElement>()
  const startCoordinates = useRef<MouseCoordinates>()

  const {
    disableInteractions = false,
    shouldPreventDefault = true,
    delay = 1000
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
      if (shouldTriggerClick && !holdTriggered && target.current) onClick()
      setHoldTriggered(false)
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener('touchend', preventDefault)
      }
      target.current = null
    },
    [shouldPreventDefault, onClick, holdTriggered, disableInteractions, target]
  )

  const watchMovement = useCallback(
    event => {
      if (target.current) {
        let x
        let y
        if (touchEvents.includes(event.type)) {
          const touch = event.touches[0] || event.changedTouches[0]
          x = touch.pageX
          y = touch.pageY
        } else if (mouseEvents.includes(event.type)) {
          x = event.clientX
          y = event.clientY
        }
        if (x && y) {
          if (startCoordinates.current) {
            const { x: startX, y: startY } = startCoordinates.current
            const deltaX = Math.abs(x - startX)
            const deltaY = Math.abs(y - startY)
            if (deltaX > MOVEMENT_THRESHOLD || deltaY > MOVEMENT_THRESHOLD) {
              clear(event, false)
            }
          } else {
            startCoordinates.current = { x, y }
          }
        }
      }
    },
    [startCoordinates, clear]
  )

  return {
    onMouseDown: e => start(e),
    onTouchStart: e => start(e),
    onMouseMove: e => watchMovement(e),
    onTouchMove: e => watchMovement(e),
    onMouseUp: e => clear(e),
    onTouchEnd: e => clear(e),
    onMouseLeave: e => clear(e, false)
  }
}

export default useClickHoldLogic
