import PowerIcon from '@mui/icons-material/Power'
import PowerOffIcon from '@mui/icons-material/PowerOff'
import { ReactElement } from 'react'
import Tile, { TileProps } from '../../basic/Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'
import { ConfirmationModalParams } from '../../../contexts/modalUtils'
import { useModalContext } from '../../../contexts/ModalContext'

export type SwitchTileProps = {
  title: string
  entityId: string
  confirmationRequired?: boolean
  disableToggle?: boolean
  onIcon?: ReactElement
  offIcon?: ReactElement
}

const SwitchTile = ({
  title,
  entityId,
  confirmationRequired,
  disableToggle,
  onIcon,
  offIcon
}: SwitchTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityId)
  const ha = useHomeAssistant()
  const modal = useModalContext()
  const isActive = entityState?.state === 'on'

  const toggleSwitch = () => {
    if (isUnavailable) return
    const action = isActive ? 'turn_off' : 'turn_on'
    ha.callService(entityState.id, 'switch', action)
  }

  const onClick = () => {
    if (confirmationRequired) {
      const params: ConfirmationModalParams = {
        message: `Are you sure you want to turn the ${title} ${
          isActive ? 'off' : 'on'
        }?`,
        onConfirm: toggleSwitch
      }
      modal.openModal('confirmation', params)
    } else {
      toggleSwitch()
    }
  }

  const tileData: TileProps = {
    title,
    subtitle: isActive ? 'on' : 'off',
    icon: isActive ? onIcon : offIcon,
    isTurnedOff: !isActive,
    iconClassnames: isActive ? 'text-green-500' : undefined,
    onClick: disableToggle ? undefined : onClick,
    isUnavailable
  }
  return <Tile {...tileData} />
}

SwitchTile.defaultProps = {
  onIcon: <PowerIcon />,
  offIcon: <PowerOffIcon />
}

export default SwitchTile
