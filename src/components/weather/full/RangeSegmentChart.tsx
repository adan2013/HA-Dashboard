import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

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
  centerValue?: number | string
  bottomValue?: number | string
  mode?: RangeSegmentMode
  activeSegment?: number
}

const RangeSegmentChart = ({
  centerValue,
  bottomValue,
  mode = 'gauge',
  activeSegment = 0
}: RangeSegmentChartProps) => {
  const colorScheme = getColorScheme(mode)

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
                key={entry.name}
                fill={getSegmentColor(idx, activeSegment, colorScheme, mode)}
                strokeWidth={0}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-10 right-1/2 translate-x-1/2 text-3xl">
        {centerValue}
      </div>
      <div className="absolute bottom-0 right-1/2 translate-x-1/2">
        {bottomValue}
      </div>
    </div>
  )
}

export default RangeSegmentChart
