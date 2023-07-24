import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { useMemo } from 'react'
import { ChartData } from './utils'
import { getHistoryStats } from '../entityTiles/climate/utils'

export type BackgroundHistoryChartProps = {
  data: ChartData[]
}

const HistoryChart = ({ data }: BackgroundHistoryChartProps) => {
  const stats = useMemo(() => getHistoryStats(data), [data])

  return (
    <ResponsiveContainer>
      <LineChart
        data={data}
        margin={{
          top: 0,
          right: 10,
          left: 10,
          bottom: 10
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#787878" />
        <XAxis dataKey="name" stroke="#ffffff" />
        <YAxis
          dataKey="value"
          type="number"
          padding={{ top: 40, bottom: 40 }}
          domain={[stats?.min, stats?.max]}
          stroke="#ffffff"
        />
        <Tooltip wrapperClassName="text-black" />
        <Line
          connectNulls
          type="monotone"
          dataKey="value"
          stroke="#ffffff"
          strokeWidth="2"
          fill="#cccccc"
        />
        <ReferenceLine y={40} label="Min" stroke="green" />
        <ReferenceLine y={60} label="Max" stroke="red" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default HistoryChart
