import { toast } from 'react-toastify'
import Tile, { TileProps } from '../../basic/Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useBackend } from '../../../contexts/BackendContext'
import DurabilityCircleChart from '../../charts/DurabilityCircleChart'
import { useModalContext } from '../../../contexts/ModalContext'
import { CountdownResetModalParams } from '../../../contexts/modalUtils'

export type DateCountdownHelperTileProps = {
  title: string
  entityId: string
  interval: number
  warningThreshold?: number
  criticalThreshold?: number
}

const DateCountdownHelperTile = ({
  title,
  entityId,
  interval,
  warningThreshold,
  criticalThreshold
}: DateCountdownHelperTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityId)
  const backend = useBackend()
  const modal = useModalContext()

  const today = new Date()
  const deadline = new Date(entityState?.state)
  deadline.setDate(deadline.getDate() + interval)
  const daysLeft =
    Math.ceil((deadline.getTime() - today.getTime()) / 86400000) || 0
  const durability = Math.ceil((daysLeft * 100) / interval)

  let chartColor = '#16a34a'
  if (warningThreshold && daysLeft <= warningThreshold) {
    chartColor = '#ea580c'
  }
  if (criticalThreshold && daysLeft <= criticalThreshold) {
    chartColor = '#ff0000'
  }

  const displayToast = () => {
    toast.info('Hold the tile to reset the countdown value')
  }

  const resetCountdown = () => {
    if (isUnavailable) return
    const params: CountdownResetModalParams = {
      title,
      currentValue: entityState.state,
      daysLeft,
      onConfirm: async selectedDate => {
        try {
          await backend.callService(
            entityState.id,
            'input_datetime',
            'set_datetime',
            { date: selectedDate }
          )
          toast.success('The countdown has been reset')
        } catch (error) {
          toast.error('Could not reset the countdown')
          throw error
        }
      }
    }
    modal.openModal('countdownReset', params)
  }

  const tileData: TileProps = {
    title,
    subtitle:
      daysLeft < 0
        ? `${Math.abs(daysLeft)} days after deadline`
        : `${daysLeft} days left`,
    metadata: [
      `${deadline.getDate()}-${
        deadline.getMonth() + 1
      }-${deadline.getFullYear()}`
    ],
    onClick: displayToast,
    onHold: resetCountdown,
    customBody: (
      <DurabilityCircleChart durability={durability || 0} color={chartColor} />
    ),
    isUnavailable,
    size: 'horizontal'
  }
  return <Tile {...tileData} />
}

export default DateCountdownHelperTile
