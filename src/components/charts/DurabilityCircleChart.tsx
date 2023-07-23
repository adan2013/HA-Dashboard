import { Pie, PieChart, ResponsiveContainer } from 'recharts'

type DurabilityChartProps = {
  durability: number
  color: string
}

const DurabilityCircleChart = ({ durability, color }: DurabilityChartProps) => (
  <div className="absolute bottom-1 right-1 aspect-square w-20">
    <ResponsiveContainer>
      <PieChart>
        <Pie
          stroke="none"
          startAngle={290}
          endAngle={-10}
          data={[
            {
              value: durability,
              fill: color
            },
            {
              value: 100 - durability,
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
      {durability}
    </div>
  </div>
)

export default DurabilityCircleChart
