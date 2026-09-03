import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import TileSection from '../components/layout/TileSection'
import TileGroup from '../components/layout/TileGroup'
import Tile from '../components/basic/Tile'
import { getPackageVersion } from '../utils/viteUtils'
import PlaceholderTile from '../PlaceholderTile'
import SpeakerTestTile from '../components/devTiles/SpeakerTestTile'
import { useBackend } from '../contexts/BackendContext'
import TriggerNotificationTile from '../components/devTiles/TriggerNotificationTile'
import { useModalContext } from '../contexts/ModalContext'

const More = () => {
  const backend = useBackend()
  const modal = useModalContext()

  const confirmLogout = () => {
    modal.openModal('confirmation', {
      message: 'Remove the saved access token and log out of the dashboard?',
      isDanger: true,
      onConfirm: () => backend.logout()
    })
  }

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
          title="Log out"
          icon={<LogoutOutlinedIcon />}
          onClick={confirmLogout}
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
