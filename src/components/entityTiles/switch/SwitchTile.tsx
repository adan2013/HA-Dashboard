import PowerIcon from '@mui/icons-material/Power'
import PowerOffIcon from '@mui/icons-material/PowerOff'
import Tile, { TileProps } from '../../Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'

type SwitchTileProps = {
  title: string
  entityName: string
  disableToggle?: boolean
}

const SwitchTile = ({ title, entityName, disableToggle }: SwitchTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityName)
  const ha = useHomeAssistant()
  const isActive = entityState?.state === 'on'

  const toggleSwitch = () => {
    if (isUnavailable) return
    const action = isActive ? 'turn_off' : 'turn_on'
    ha.callService(entityState.id, 'switch', action)
  }

  const tileData: TileProps = {
    title,
    subtitle: isActive ? 'on' : 'off',
    icon: isActive ? <PowerIcon /> : <PowerOffIcon />,
    isTurnedOff: !isActive,
    iconClassnames: isActive ? 'text-green-500' : undefined,
    onClick: disableToggle ? undefined : toggleSwitch,
    isUnavailable
  }
  return <Tile {...tileData} />
}

export default SwitchTile
