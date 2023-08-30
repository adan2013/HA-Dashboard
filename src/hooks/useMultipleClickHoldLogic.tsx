import { useEffect, useRef, useState } from 'react'
import useClickHoldLogic, { ClickHoldLogicOptions } from './useClickHoldLogic'

const useMultipleClickHoldLogic = (
  onClick: (count: number) => void,
  onHold: () => void,
  multipleClickDelay = 500,
  options: ClickHoldLogicOptions = {}
) => {
  const timeoutRef = useRef<number>()
  const [counter, setCounter] = useState(0)
  const interactionEvents = useClickHoldLogic(
    () => {
      setCounter(c => c + 1)
    },
    onHold,
    options
  )

  useEffect(() => {
    if (counter > 0) {
      timeoutRef.current = window.setTimeout(() => {
        onClick(counter)
        setCounter(0)
      }, multipleClickDelay)
    }
    return () => window.clearTimeout(timeoutRef.current)
  }, [counter, multipleClickDelay, onClick, timeoutRef])

  return interactionEvents
}

export default useMultipleClickHoldLogic
