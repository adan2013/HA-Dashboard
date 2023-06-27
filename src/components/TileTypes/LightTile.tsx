import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LightOutlinedIcon from '@mui/icons-material/LightOutlined'
import LightIcon from '@mui/icons-material/Light'
import Tile, { TileProps } from '../Tile'

type LightType = 'bulb' | 'ceiling'
type ActionType = 'toggle' | 'manual'
type LightTileProps = {
  title: string
  lightType: LightType
  actionType: ActionType
}

const getStatusSubtitle = (actionType: ActionType, isActive: boolean) => {
  switch (actionType) {
    case 'toggle':
      return isActive ? 'On' : 'Off'
    default:
      return 'Manual'
  }
}

const getIcon = (lightType: LightType, isActive: boolean) => {
  switch (lightType) {
    case 'ceiling':
      return isActive ? <LightOutlinedIcon /> : <LightIcon />
    default:
      return isActive ? <LightbulbIcon /> : <LightbulbOutlinedIcon />
  }
}

const LightTile = ({ title, lightType, actionType }: LightTileProps) => {
  const isActive = true
  const isUnavailable = false // TODO remove this

  const tileData: TileProps = {
    title,
    subtitle: getStatusSubtitle(actionType, isActive),
    icon: getIcon(lightType, isActive),
    turnedOff: !isActive,
    disabled: isUnavailable,
    iconClassnames: isActive ? 'text-yellow-500' : undefined
  }
  return <Tile {...tileData} />
}

export default LightTile
