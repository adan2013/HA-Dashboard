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
      <Tooltip wrapperClassName="text-black" />
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
