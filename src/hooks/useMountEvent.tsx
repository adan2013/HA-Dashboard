import { EffectCallback, useEffect, useRef } from 'react'

const useMountEvent = (effect: EffectCallback) => {
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      effect()
      firstRender.current = false
    }
  }, [effect])
}

export default useMountEvent
