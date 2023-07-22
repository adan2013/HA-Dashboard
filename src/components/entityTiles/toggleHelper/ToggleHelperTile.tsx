import { ReactElement } from 'react'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined'
import Tile, { TileProps } from '../../Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'

type ToggleHelperTileProps = {
  title: string
  entityName: string
  readonly?: boolean
  reverseState?: boolean
  onColor?: string
  offColor?: string
  onIcon?: ReactElement
  offIcon?: ReactElement
  stateNames?: [string, string]
}

const ToggleHelperTile = ({
  title,
  entityName,
  readonly,
  reverseState,
  onColor,
  offColor,
  onIcon,
  offIcon,
  stateNames
}: ToggleHelperTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityName)
  const ha = useHomeAssistant()

  const entityIsActive = entityState?.state === 'on'
  const isActive = reverseState ? !entityIsActive : entityIsActive
  const toggleLight = () => {
    if (isUnavailable) return
    const action = entityIsActive ? 'turn_off' : 'turn_on'
    ha.callService(entityState.id, 'input_boolean', action)
  }

  const tileData: TileProps = {
    title,
    subtitle: stateNames ? stateNames[isActive ? 1 : 0] : entityState?.state,
    icon: isActive ? onIcon : offIcon,
    isTurnedOff: !isActive,
    iconClassnames: isActive ? onColor : offColor,
    onClick: readonly ? undefined : toggleLight,
    isUnavailable
  }
  return <Tile {...tileData} />
}

ToggleHelperTile.defaultProps = {
  onColor: 'text-green-500',
  offColor: undefined,
  onIcon: <ToggleOnOutlinedIcon />,
  offIcon: <ToggleOffOutlinedIcon />
}

export default ToggleHelperTile
