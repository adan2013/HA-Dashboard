import {
  HTMLAttributes,
  MouseEventHandler,
  TouchEventHandler,
  useRef
} from 'react'
import { clampValue } from '../../../utils/numberUtils'

export type LightSliderProps = {
  title: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  onConfirm: () => void
}

export const LightSlider = ({
  title,
  value,
  min,
  max,
  onChange,
  onConfirm
}: LightSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const percentage = value
    ? Math.round(clampValue(((value - min) / (max - min)) * 100, 0, 100))
    : 0

  const onMove = (clientX: number) => {
    const startPoint = containerRef.current.getBoundingClientRect().left
    const endPoint = containerRef.current.getBoundingClientRect().right
    const newPercentage = clampValue(
      Math.ceil(((clientX - startPoint) / (endPoint - startPoint)) * 100),
      0,
      100
    )
    onChange(Math.ceil((newPercentage / 100) * (max - min) + min))
  }

  const onMouseMove: MouseEventHandler<HTMLDivElement> = e => {
    if (e.buttons) onMove(e.clientX)
  }

  const onTouchMove: TouchEventHandler<HTMLDivElement> = e => {
    if (e.touches.length) onMove(e.touches[0].clientX)
  }

  const onLeave: MouseEventHandler<HTMLDivElement> = e => {
    if (e.buttons) {
      onConfirm()
    }
  }

  const events: Partial<HTMLAttributes<HTMLDivElement>> = {
    onMouseDown: onMouseMove,
    onTouchStart: onTouchMove,
    onMouseMove,
    onTouchMove,
    onMouseUp: onConfirm,
    onTouchEnd: onConfirm,
    onMouseLeave: onLeave
  }

  return (
    <div className="mx-3 my-1">
      <div className="my-2 text-center">{title}</div>
      <div
        className="relative h-14 w-full overflow-hidden rounded-lg bg-black"
        ref={containerRef}
      >
        <div
          className="absolute z-10 h-full bg-yellow-400"
          data-testid={`value-slider-${title}`}
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute z-20 h-full w-full cursor-pointer"
          data-testid={`slider-${title}`}
          {...events}
        />
      </div>
    </div>
  )
}
