import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined'
import { toast } from 'react-toastify'
import Tile, { TileProps } from '../../basic/Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useBackend } from '../../../contexts/BackendContext'
import { useModalContext } from '../../../contexts/ModalContext'
import { TimeRangeScheduleModalParams } from '../../../contexts/modalUtils'
import {
  DEFAULT_TIME_RANGE,
  formatTime,
  formatTimeRange,
  parseTimeRange
} from '../../../utils/timeRangeUtils'

export type TimeRangeScheduleTileProps = {
  title: string
  entityId: string
}

const TimeRangeScheduleTile = ({
  title,
  entityId
}: TimeRangeScheduleTileProps) => {
  const { entityState, isLoading } = useHomeAssistantEntity(entityId)
  const backend = useBackend()
  const modal = useModalContext()
  const range = parseTimeRange(entityState?.state)

  const editSchedule = () => {
    const params: TimeRangeScheduleModalParams = {
      title,
      currentValue: range ? formatTimeRange(range) : DEFAULT_TIME_RANGE,
      onConfirm: async value => {
        await backend.callService(entityId, 'input_text', 'set_value', {
          value
        })
        toast.success('The schedule has been updated')
      }
    }
    modal.openModal('timeRangeSchedule', params)
  }

  const tileData: TileProps = {
    title,
    metadata: range
      ? [formatTime(range.start), formatTime(range.end)]
      : ['Invalid', 'schedule'],
    icon: <AccessTimeOutlinedIcon />,
    iconClassnames: range ? 'text-white' : 'text-red-300',
    tileColor: range ? undefined : 'bg-red-500',
    onClick: editSchedule,
    isLoading
  }

  return <Tile {...tileData} />
}

export default TimeRangeScheduleTile
