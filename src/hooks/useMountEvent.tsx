import { EffectCallback, useEffect, useRef } from 'react'

const useMountEvent = (effect: EffectCallback) => {
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return effect()
    }
    return undefined
  }, [effect])
}

export default useMountEvent
