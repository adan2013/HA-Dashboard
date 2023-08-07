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
import { ChartData, ValueThreshold } from './utils'

export type BackgroundHistoryChartProps = {
  data: ChartData[]
  thresholds?: ValueThreshold[]
}

const TooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded bg-gray-100 p-2 text-left text-sm text-black">
        Time difference: {label}
        <br />
        Date: {new Date(payload[0].payload.id).toLocaleString()}
        <br />
        Value: {payload[0].value}
        <br />
      </div>
    )
  }

  return null
}

const HistoryChart = ({ data, thresholds }: BackgroundHistoryChartProps) => (
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
        domain={['dataMin', 'dataMax']}
        stroke="#ffffff"
      />
      <Tooltip wrapperClassName="text-black" content={<TooltipContent />} />
      <Line
        connectNulls
        type="monotone"
        dataKey="value"
        stroke="#ffffff"
        strokeWidth="2"
        fill="#cccccc"
      />
      {thresholds.map(({ label, color, value }) => (
        <ReferenceLine key={label} y={value} label={label} stroke={color} />
      ))}
    </LineChart>
  </ResponsiveContainer>
)

HistoryChart.defaultProps = {
  thresholds: []
}

export default HistoryChart
