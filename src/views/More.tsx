import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import TileSection from '../components/layout/TileSection'
import TileGroup from '../components/layout/TileGroup'
import Tile from '../components/basic/Tile'
import { getPackageVersion } from '../utils/viteUtils'
import PlaceholderTile from '../PlaceholderTile'
import SpeakerTestTile from '../components/devTiles/SpeakerTestTile'

const More = () => (
  <TileSection waitForConnection={false}>
    <TileGroup name="Language">
      <PlaceholderTile title="Polish" size="standard" />
      <PlaceholderTile title="English" size="standard" />
    </TileGroup>
    <TileGroup name="Dev">
      <Tile
        title="Dashboard version"
        customBody={
          <div className="absolute bottom-1 right-2 text-4xl">
            {getPackageVersion()}
          </div>
        }
      />
      <Tile
        title="Backend version"
        customBody={
          <div className="absolute bottom-1 right-2 text-4xl">-.-.-</div>
        }
      />
      <Tile
        title="Fully Kiosk API"
        icon={Object.hasOwn(window, 'fully') ? <CheckIcon /> : <ClearIcon />}
      />
      <SpeakerTestTile />
    </TileGroup>
  </TileSection>
)

export default More
