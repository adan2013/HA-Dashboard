import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { readBatteryEntity } from '../../../utils/batteryUtils'
import ToggleHelperTile from '../helpers/ToggleHelperTile'

export type WaterLeakSensorTileProps = {
  title: string
  entityId: string
  batteryEntityId: string
}

const WaterLeakSensorTile = ({
  title,
  entityId,
  batteryEntityId
}: WaterLeakSensorTileProps) => {
  const { entityState } = useHomeAssistantEntity(batteryEntityId)
  const level = entityState && readBatteryEntity(entityState)?.level

  return (
    <ToggleHelperTile
      title={title}
      entityId={entityId}
      stateNames={['ready', 'ALARM']}
      onColor="text-red-600"
      onIcon={<WaterDropIcon />}
      offIcon={<WaterDropOutlinedIcon />}
      readonly
      tileProps={{ isTurnedOff: false }}
      metadataRenderer={() => [`${level ?? '--'}%`]}
    />
  )
}

export default WaterLeakSensorTile
