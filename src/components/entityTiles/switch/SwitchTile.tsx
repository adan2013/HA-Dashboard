import PowerIcon from '@mui/icons-material/Power'
import PowerOffIcon from '@mui/icons-material/PowerOff'
import Tile, { TileProps } from '../../basic/Tile'
import { useHomeAssistantEntity } from '../../../api/hooks'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'
import { ConfirmationModalParams } from '../../../contexts/modalUtils'
import { useModalContext } from '../../../contexts/ModalContext'

type SwitchTileProps = {
  title: string
  entityName: string
  confirmationRequired?: boolean
  disableToggle?: boolean
}

const SwitchTile = ({
  title,
  entityName,
  confirmationRequired,
  disableToggle
}: SwitchTileProps) => {
  const { entityState, isUnavailable } = useHomeAssistantEntity(entityName)
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
    icon: isActive ? <PowerIcon /> : <PowerOffIcon />,
    isTurnedOff: !isActive,
    iconClassnames: isActive ? 'text-green-500' : undefined,
    onClick: disableToggle ? undefined : onClick,
    isUnavailable
  }
  return <Tile {...tileData} />
}

export default SwitchTile
