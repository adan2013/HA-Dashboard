import { MouseEvent, PointerEvent, useEffect, useRef } from 'react'

export type ClickHoldLogicOptions = {
  disableInteractions?: boolean
  holdOnRightClick?: boolean
  delay?: number
}

const MOVEMENT_THRESHOLD = 10

const useClickHoldLogic = (
  onClick?: () => void,
  onHold?: () => void,
  options: ClickHoldLogicOptions = {}
) => {
  const timeout = useRef<number>()
  const startCoordinates = useRef<{ x: number; y: number }>()
  const suppressClick = useRef(false)
  const holdTriggered = useRef(false)

  const {
    disableInteractions = false,
    holdOnRightClick = true,
    delay = 1000
  } = options

  const clearTimer = () => {
    if (timeout.current !== undefined) {
      window.clearTimeout(timeout.current)
      timeout.current = undefined
    }
  }

  const cancelGesture = () => {
    clearTimer()
    suppressClick.current = true
    startCoordinates.current = undefined
  }

  useEffect(() => () => clearTimer(), [])

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (disableInteractions || event.button !== 0) return

    clearTimer()
    suppressClick.current = false
    holdTriggered.current = false
    startCoordinates.current = { x: event.clientX, y: event.clientY }

    if (onHold) {
      timeout.current = window.setTimeout(() => {
        holdTriggered.current = true
        suppressClick.current = true
        onHold()
      }, delay)
    }
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const start = startCoordinates.current
    if (!start) return

    const deltaX = Math.abs(event.clientX - start.x)
    const deltaY = Math.abs(event.clientY - start.y)
    if (deltaX > MOVEMENT_THRESHOLD || deltaY > MOVEMENT_THRESHOLD) {
      cancelGesture()
    }
  }

  const onPointerUp = () => {
    clearTimer()
    startCoordinates.current = undefined
  }

  const onPointerCancel = () => cancelGesture()

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disableInteractions || suppressClick.current || holdTriggered.current) {
      event.preventDefault()
      event.stopPropagation()
      suppressClick.current = false
      holdTriggered.current = false
      return
    }
    onClick?.()
  }

  const onContextMenu = (event: MouseEvent<HTMLElement>) => {
    if (!holdOnRightClick || disableInteractions || !onHold) return
    event.preventDefault()
    clearTimer()
    suppressClick.current = true
    if (!holdTriggered.current) onHold()
    holdTriggered.current = true
  }

  return {
    onClick: handleClick,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onPointerLeave: onPointerCancel,
    onContextMenu
  }
}

export default useClickHoldLogic
