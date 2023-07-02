import { ReactElement, useState } from 'react'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import Tile, { TileProps } from '../../Tile'
import { useHomeAssistant } from '../../../contexts/HomeAssistantContext'

type ToggleHelperTileProps = {
  title: string
  icon?: ReactElement
  domain: string
  service: string
  payload?: object
}

const CallServiceTile = ({
  title,
  icon,
  domain,
  service,
  payload
}: ToggleHelperTileProps) => {
  const [disabled, setDisabled] = useState(false)
  const ha = useHomeAssistant()

  const callService = () => {
    ha.callService(undefined, domain, service, payload)
    setDisabled(true)
    setTimeout(() => setDisabled(false), 1000)
  }

  const tileData: TileProps = {
    title,
    icon: disabled ? <CachedOutlinedIcon /> : icon,
    iconClassnames: disabled ? 'animate-spin opacity-30' : undefined,
    onClick: disabled ? undefined : callService
  }
  return <Tile {...tileData} />
}

CallServiceTile.defaultProps = {
  icon: undefined,
  payload: undefined
}

export default CallServiceTile
