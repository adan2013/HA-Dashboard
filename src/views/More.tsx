import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import TileSection from '../components/layout/TileSection'
import TileGroup from '../components/layout/TileGroup'
import Tile from '../components/basic/Tile'
import { getPackageVersion } from '../utils/viteUtils'
import PlaceholderTile from '../PlaceholderTile'
import SpeakerTestTile from '../components/devTiles/SpeakerTestTile'
import { useBackend } from '../contexts/BackendContext'
import TriggerNotificationTile from '../components/devTiles/TriggerNotificationTile'

const More = () => {
  const backend = useBackend()

  return (
    <TileSection waitForConnection={false}>
      <TileGroup name="Info">
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
            <div className="absolute bottom-1 right-2 text-4xl">
              {backend?.version || '-.-.-'}
            </div>
          }
        />
        <Tile
          title="Fully Kiosk API"
          icon={Object.hasOwn(window, 'fully') ? <CheckIcon /> : <ClearIcon />}
        />
      </TileGroup>
      <TileGroup name="Testing">
        <SpeakerTestTile />
        <TriggerNotificationTile />
        <PlaceholderTile title="Send test SMS" size="standard" />
      </TileGroup>
    </TileSection>
  )
}

export default More
