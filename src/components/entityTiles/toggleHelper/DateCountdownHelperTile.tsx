import { PieChart, Pie, ResponsiveContainer } from 'recharts'
import { toast } from 'react-toastify'
import Tile, { TileProps } from '../../Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'

type DurabilityChartProps = {
  durability: number
  color: string
}

const DurabilityChart = ({ durability, color }: DurabilityChartProps) => (
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

type DateCountdownHelperTileProps = {
  title: string
  entityName: string
  interval: number
  warningThreshold?: number
  criticalThreshold?: number
}

const DateCountdownHelperTile = ({
  title,
  entityName,
  interval,
  warningThreshold,
  criticalThreshold
}: DateCountdownHelperTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityName)
  const ha = useHomeAssistant()

  const today = new Date()
  const deadline = new Date(entityState?.state)
  deadline.setDate(deadline.getDate() + interval)
  const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / 86400000)
  const durability = Math.max(Math.ceil((daysLeft * 100) / interval), 0)

  let chartColor = '#16a34a'
  if (warningThreshold && durability < warningThreshold) {
    chartColor = '#ea580c'
  }
  if (criticalThreshold && durability < criticalThreshold) {
    chartColor = '#dc2626'
  }

  const displayToast = () => {
    toast.info('Hold the tile to reset the countdown value')
  }

  const resetCountdown = () => {
    // TODO add modal confirmation
    if (isUnavailable) return
    ha.callService(entityState.id, 'input_datetime', 'set_datetime', {
      datetime: new Date().toISOString()
    })
    toast.success('The countdown has been reset')
  }

  const tileData: TileProps = {
    title,
    subtitle: `${daysLeft} days left`,
    metadata: [
      `${deadline.getDate()}-${
        deadline.getMonth() + 1
      }-${deadline.getFullYear()}`
    ],
    onClick: displayToast,
    onHold: resetCountdown,
    customBody: (
      <DurabilityChart durability={durability || 0} color={chartColor} />
    ),
    isUnavailable,
    size: 'horizontal'
  }
  return <Tile {...tileData} />
}

export default DateCountdownHelperTile
