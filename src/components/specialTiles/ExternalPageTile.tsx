import { ReactElement } from 'react'
import LogoutIcon from '@mui/icons-material/Logout'
import Tile from '../basic/Tile'

type ExternalPageTileProps = {
  title: string
  icon?: ReactElement
  url: string
}

const ExternalPageTile = ({ title, icon, url }: ExternalPageTileProps) => (
  <Tile
    title={title}
    icon={icon || <LogoutIcon />}
    onClick={() => window.open(url, '_self')}
  />
)

export default ExternalPageTile
