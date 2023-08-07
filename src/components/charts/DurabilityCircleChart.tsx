import { Pie, PieChart, ResponsiveContainer } from 'recharts'
import { clampValue } from './utils'

type DurabilityChartProps = {
  durability: number
  color: string
}

const DurabilityCircleChart = ({ durability, color }: DurabilityChartProps) => {
  const percent = Math.round(clampValue(durability, 0, 100)) || 0
  return (
    <div className="absolute bottom-1 right-1 aspect-square w-20">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            stroke="none"
            startAngle={290}
            endAngle={-10}
            data={[
              {
                value: percent,
                fill: color
              },
              {
                value: 100 - percent,
                fill: '#868686'
              }
            ]}
            dataKey="value"
            innerRadius="75%"
            outerRadius="100%"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-2 right-2">%</div>
      <div className="flex-center absolute bottom-1 right-1 aspect-square w-20 pl-2 pt-2 text-lg">
        {percent}
      </div>
    </div>
  )
}

export default DurabilityCircleChart
