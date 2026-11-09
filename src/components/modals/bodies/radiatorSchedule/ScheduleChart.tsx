import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import {
  SchedulePoint,
  scheduleTemperatureRange,
  scheduleTime
} from '../../../../utils/radiatorSchedule'

type Props = {
  points: SchedulePoint[]
  label: string
  compact?: boolean
  activeIndex?: number
  onSelect?: (index: number) => void
  disabled?: boolean
  fitContainer?: boolean
}

const ScheduleChart = ({
  points,
  label,
  compact = false,
  activeIndex,
  onSelect,
  disabled,
  fitContainer = false
}: Props) => {
  const container = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: compact ? 320 : 800, height: 240 })
  useEffect(() => {
    const measure = () => {
      if (container.current?.clientWidth)
        setSize({
          width: container.current.clientWidth,
          height: container.current.clientHeight
        })
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(container.current)
    return () => observer.disconnect()
  }, [])
  const { width } = size
  let height = compact ? 150 : Math.max(200, Math.min(280, width * 0.35))
  if (fitContainer) height = Math.max(60, size.height)
  const left = 36
  const right = width - 16
  const top = 18
  const bottom = height - 30
  const { min, max } = scheduleTemperatureRange(points)
  const x = (minutes: number) => left + (minutes / 1440) * (right - left)
  const y = (temperature: number) =>
    bottom - ((temperature - min) / (max - min)) * (bottom - top)
  const line = points
    .map((point, index) =>
      index === 0
        ? `M${x(point.minutes)},${y(point.temperature)}`
        : `H${x(point.minutes)}V${y(point.temperature)}`
    )
    .join(' ')
  const path = `${line}H${right}`
  const degrees = Array.from({ length: max - min + 1 }, (_, i) => min + i)
  const labelInterval = Math.max(
    1,
    Math.ceil((max - min) / Math.max(2, Math.floor((height - 48) / 24)))
  )

  return (
    <div
      ref={container}
      className={clsx('relative w-full', fitContainer && 'h-full')}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={clsx(
          'block w-full overflow-visible',
          fitContainer && 'h-full'
        )}
        role="img"
        aria-label={`${label} temperature schedule, ${points
          .map(point => `${scheduleTime(point.minutes)} ${point.temperature}°C`)
          .join(', ')}`}
      >
        <text x="4" y="12" fill="#9ca3af" fontSize="11">
          °C
        </text>
        {Array.from({ length: 25 }, (_, hour) => (
          <g key={hour}>
            <line
              x1={x(hour * 60)}
              x2={x(hour * 60)}
              y1={top}
              y2={bottom}
              stroke={hour % 3 === 0 ? '#64748b' : '#374151'}
              strokeWidth={hour % 3 === 0 ? 1.2 : 0.5}
              vectorEffect="non-scaling-stroke"
            />
            {hour % (compact ? 6 : 3) === 0 && (
              <text
                x={x(hour * 60)}
                y={bottom + 20}
                textAnchor="middle"
                fill="#9ca3af"
                fontSize="11"
              >
                {String(hour).padStart(2, '0')}
              </text>
            )}
          </g>
        ))}
        {degrees.map(degree => (
          <g key={degree}>
            <line
              x1={left}
              x2={right}
              y1={y(degree)}
              y2={y(degree)}
              stroke="#475569"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
            />
            {(degree === min ||
              degree === max ||
              (degree - min) % labelInterval === 0) && (
              <text
                x={left - 8}
                y={y(degree) + 4}
                textAnchor="end"
                fill="#9ca3af"
                fontSize="11"
              >
                {degree}
              </text>
            )}
          </g>
        ))}
        <path
          d={`${path}V${bottom}H${left}Z`}
          fill="#38bdf8"
          fillOpacity="0.17"
        />
        <path
          d={path}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {points.map((point, index) => (
          <circle
            key={point.minutes}
            cx={x(point.minutes)}
            cy={y(point.temperature)}
            r={index === activeIndex ? 7 : 5}
            fill={index === activeIndex ? '#ffffff' : '#38bdf8'}
          />
        ))}
      </svg>
      {onSelect &&
        points.map((point, index) => (
          <button
            key={point.minutes}
            type="button"
            aria-label={`Select point ${index + 1}: ${scheduleTime(
              point.minutes
            )}, ${point.temperature}°C`}
            aria-pressed={index === activeIndex}
            disabled={disabled}
            onClick={() => onSelect(index)}
            className="absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            style={{
              left: `${(x(point.minutes) / width) * 100}%`,
              top: `${(y(point.temperature) / height) * 100}%`
            }}
          >
            {index === activeIndex && (
              <span className="mx-auto block h-5 w-5 rounded-full border-2 border-white bg-sky-400 shadow-[0_0_0_5px_rgba(56,189,248,0.25)]" />
            )}
          </button>
        ))}
    </div>
  )
}

export default ScheduleChart
