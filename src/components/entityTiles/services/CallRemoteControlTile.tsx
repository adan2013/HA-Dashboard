import { ReactElement, useState } from 'react'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import Tile, { TileProps } from '../../basic/Tile'
import { useBackend } from '../../../contexts/BackendContext'

type CallRemoteControlTileProps = {
  title: string
  icon?: ReactElement
  entityId: string
  button: string
}

const CallRemoteControlTile = ({
  title,
  icon,
  entityId,
  button
}: CallRemoteControlTileProps) => {
  const [disabled, setDisabled] = useState(false)
  const backend = useBackend()

  const onClick = () => {
    backend.triggerRemoteControl(entityId, button)
    setDisabled(true)
    setTimeout(() => setDisabled(false), 1000)
  }

  const tileData: TileProps = {
    title,
    icon: disabled ? <CachedOutlinedIcon /> : icon,
    iconClassnames: disabled ? 'animate-spin opacity-30' : undefined,
    onClick: disabled ? undefined : onClick
  }
  return <Tile {...tileData} />
}

export default CallRemoteControlTile
