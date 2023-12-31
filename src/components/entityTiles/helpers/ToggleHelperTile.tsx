import { ReactElement } from 'react'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined'
import Tile, { TileProps } from '../../basic/Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'
import { EntityState } from '../../../api/utils'

export type ToggleHelperTileProps = {
  title: string
  entityId: string
  readonly?: boolean
  reverseState?: boolean
  onColor?: string
  offColor?: string
  onIcon?: ReactElement
  offIcon?: ReactElement
  stateNames?: [string, string]
  metadataRenderer?: (entity: EntityState) => string[]
  tileProps?: Partial<TileProps>
}

const ToggleHelperTile = ({
  title,
  entityId,
  readonly,
  reverseState,
  onColor,
  offColor,
  onIcon,
  offIcon,
  stateNames,
  metadataRenderer,
  tileProps
}: ToggleHelperTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityId)
  const ha = useHomeAssistant()

  const entityIsActive = entityState?.state === 'on'
  const isActive = reverseState ? !entityIsActive : entityIsActive
  const toggleEntity = () => {
    if (isUnavailable) return
    const action = entityIsActive ? 'turn_off' : 'turn_on'
    ha.callService(entityState.id, 'input_boolean', action)
  }

  let subtitle = entityState?.state
  if (reverseState) {
    if (subtitle === 'on') {
      subtitle = 'off'
    } else if (subtitle === 'off') {
      subtitle = 'on'
    }
  }
  if (stateNames) {
    subtitle = stateNames[isActive ? 1 : 0]
  }
  if (isUnavailable) {
    subtitle = 'unknown'
  }

  const tileData: TileProps = {
    title,
    subtitle,
    metadata: metadataRenderer ? metadataRenderer(entityState) : undefined,
    icon: isActive ? onIcon : offIcon,
    isTurnedOff: !isActive,
    iconClassnames: !isUnavailable && isActive ? onColor : offColor,
    onClick: readonly ? undefined : toggleEntity,
    isUnavailable,
    ...tileProps
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
