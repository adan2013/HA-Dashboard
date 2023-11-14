import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'

type RangeSegmentMode = 'gauge' | 'range'

const CHART_DATA = [
  { name: 'A', value: 20 },
  { name: 'B', value: 20 },
  { name: 'C', value: 20 },
  { name: 'D', value: 20 },
  { name: 'E', value: 20 }
]

const INACTIVE_COLOR = '#6b7280'
const GAUGE_COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444', '#a855f7']
const RANGE_COLORS = ['#f97316', '#eab308', '#22c55e', '#eab308', '#f97316']

const getColorScheme = (mode: RangeSegmentMode) => {
  switch (mode) {
    case 'range':
      return RANGE_COLORS
    default:
      return GAUGE_COLORS
  }
}

const getSegmentColor = (
  idx: number,
  activeSegment: number,
  colorScheme: string[],
  mode: RangeSegmentMode
): string => {
  let isActive: boolean
  switch (mode) {
    case 'range':
      isActive = idx + 1 === activeSegment
      break
    default:
      isActive = idx + 1 <= activeSegment
  }
  return isActive ? colorScheme[idx] : INACTIVE_COLOR
}

export type RangeSegmentChartProps = {
  value?: number
  label?: string
  mode?: RangeSegmentMode
  thresholds: [number, number, number, number]
}

const RangeSegmentChart = ({
  value = 0,
  label,
  mode = 'gauge',
  thresholds
}: RangeSegmentChartProps) => {
  const colorScheme = getColorScheme(mode)

  const activeSegment = useMemo(() => {
    let segment = 0
    const [t1, t2, t3, t4] = thresholds
    if (value <= t1) {
      segment = 1
    } else if (value <= t2) {
      segment = 2
    } else if (value <= t3) {
      segment = 3
    } else if (value <= t4) {
      segment = 4
    } else if (value > t4) {
      segment = 5
    }
    return segment
  }, [value, thresholds])

  return (
    <div className="relative h-32">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            cy="58%"
            animationDuration={0}
            data={CHART_DATA}
            startAngle={215}
            endAngle={-35}
            innerRadius={55}
            outerRadius={70}
            fill="#8884d8"
            paddingAngle={8}
            dataKey="value"
          >
            {CHART_DATA.map((entry, idx) => (
              <Cell
                name={entry.name}
                key={entry.name}
                fill={getSegmentColor(idx, activeSegment, colorScheme, mode)}
                strokeWidth={0}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-10 right-1/2 translate-x-1/2 text-3xl">
        {value}
      </div>
      <div className="absolute bottom-0 right-1/2 translate-x-1/2">{label}</div>
    </div>
  )
}

export default RangeSegmentChart
