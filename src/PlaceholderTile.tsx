import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined'
import Tile, { TileSize } from './components/basic/Tile'

type TilePlaceholderProps = {
  title: string
  size: TileSize
}

const PlaceholderTile = ({ title, size }: TilePlaceholderProps) => (
  <Tile
    title={title}
    size={size}
    metadata={['Placeholder']}
    icon={<ConstructionOutlinedIcon />}
    iconClassnames="opacity-20"
  />
)

export default PlaceholderTile
