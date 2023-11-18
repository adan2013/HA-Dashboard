import {
  BarChart,
  Bar,
  ResponsiveContainer,
  YAxis,
  ReferenceLine,
  Cell
} from 'recharts'
import { useMemo } from 'react'

const BAR_COLOR = '#a855f7'

export type BarHistoryChartProps = {
  history: number[]
  chartColor?: string
  negativeChartColor?: string
  minRangeOffset?: number
}

const BarHistoryChart = ({
  history,
  chartColor,
  negativeChartColor,
  minRangeOffset
}: BarHistoryChartProps) => {
  const chartData = useMemo(
    () =>
      history.map((h, idx) => ({
        key: idx,
        value: h
      })),
    [history]
  )

  const min = useMemo(() => Math.min(...history), [history])
  const max = useMemo(() => Math.max(...history), [history])

  if (history.length === 0) return null

  return (
    <div className="h-32">
      <div className="mx-1 h-28">
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <ReferenceLine y={0} stroke="#d6d3d1" />
            <Bar dataKey="value">
              {chartData.map(({ key, value }) => (
                <Cell
                  fill={
                    value > 0
                      ? chartColor || BAR_COLOR
                      : negativeChartColor || chartColor || BAR_COLOR
                  }
                  key={key}
                />
              ))}
            </Bar>
            <YAxis
              type="number"
              domain={[
                minRangeOffset ? `dataMin - ${minRangeOffset}` : '0',
                'dataMax'
              ]}
              hide
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="relative">
        <div className="absolute left-2">
          {min}
          <span className="mx-2 text-xs opacity-60">MIN</span>
        </div>
        <div className="absolute right-2">
          <span className="mx-2 text-xs opacity-60">MAX</span>
          {max}
        </div>
      </div>
    </div>
  )
}

export default BarHistoryChart
