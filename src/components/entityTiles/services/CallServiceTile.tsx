import { ReactElement, useState } from 'react'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import Tile, { TileProps } from '../../basic/Tile'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'
import { useModalContext } from '../../modals/ModalContext'
import { ConfirmationModalParams } from '../../modals/utils'

type ToggleHelperTileProps = {
  title: string
  icon?: ReactElement
  domain: string
  service: string
  payload?: object
  confirmationRequired?: boolean
}

const CallServiceTile = ({
  title,
  icon,
  domain,
  service,
  payload,
  confirmationRequired
}: ToggleHelperTileProps) => {
  const [disabled, setDisabled] = useState(false)
  const ha = useHomeAssistant()
  const modal = useModalContext()

  const callService = () => {
    ha.callService(undefined, domain, service, payload)
    setDisabled(true)
    setTimeout(() => setDisabled(false), 1000)
  }

  const onClick = () => {
    if (confirmationRequired) {
      const params: ConfirmationModalParams = {
        isDanger: true,
        onConfirm: callService
      }
      modal.openModal('confirmation', params)
    } else {
      callService()
    }
  }

  const tileData: TileProps = {
    title,
    icon: disabled ? <CachedOutlinedIcon /> : icon,
    iconClassnames: disabled ? 'animate-spin opacity-30' : undefined,
    onClick: disabled ? undefined : onClick
  }
  return <Tile {...tileData} />
}

export default CallServiceTile
