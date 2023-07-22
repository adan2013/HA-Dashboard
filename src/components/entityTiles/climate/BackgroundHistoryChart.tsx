import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts'
import { useMemo } from 'react'

export type ChartData = {
  id: string
  value: number
}

export type BackgroundHistoryChartProps = {
  data: ChartData[]
  minValue?: number
  maxValue?: number
}

const BackgroundHistoryChart = ({
  data,
  minValue,
  maxValue
}: BackgroundHistoryChartProps) => {
  const transformedData = useMemo(() => {
    if (minValue === undefined || maxValue === undefined) {
      return data
    }
    return data.map(item => ({
      ...item,
      value: Math.min(maxValue, Math.max(minValue, item.value))
    }))
  }, [data, minValue, maxValue])

  return (
    <div className="absolute bottom-0 left-0 h-24 w-full overflow-hidden rounded-b-md opacity-30">
      <ResponsiveContainer>
        <AreaChart
          data={transformedData}
          margin={{
            top: 0,
            right: 0,
            bottom: 0,
            left: 0
          }}
        >
          <Area
            type="monotone"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth="2"
            fill="#ababab"
          />
          <YAxis type="number" domain={[minValue, maxValue]} hide />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BackgroundHistoryChart
