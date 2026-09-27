import ClearIcon from '@mui/icons-material/Clear'
import CheckIcon from '@mui/icons-material/Check'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined'
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined'
import { useState } from 'react'
import TileSection from '../components/layout/TileSection'
import TileGroup from '../components/layout/TileGroup'
import Tile from '../components/basic/Tile'
import { getPackageVersion } from '../utils/viteUtils'
import SpeakerTestTile from '../components/devTiles/SpeakerTestTile'
import { useBackend } from '../contexts/BackendContext'
import TriggerNotificationTile from '../components/devTiles/TriggerNotificationTile'
import { useModalContext } from '../contexts/ModalContext'
import LightTile from '../components/entityTiles/lights/LightTile'
import { useBackendStatus } from '../api/hooks'

const More = () => {
  const backend = useBackend()
  const modal = useModalContext()
  const backendStatus = useBackendStatus()
  const [sendingTestSms, setSendingTestSms] = useState(false)

  const sendTestSms = () => {
    backend.sendTestSms()
    setSendingTestSms(true)
    setTimeout(() => setSendingTestSms(false), 3000)
  }

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
        <LightTile
          title="Notification LED"
          entityId="light.dash_node_tablet_notification_lights"
        />
        <Tile
          title="Send test SMS"
          subtitle={sendingTestSms ? 'Sending...' : undefined}
          icon={sendingTestSms ? <CachedOutlinedIcon /> : <SmsOutlinedIcon />}
          iconClassnames={
            sendingTestSms ? 'animate-spin opacity-30' : undefined
          }
          onClick={sendingTestSms ? undefined : sendTestSms}
          isUnavailable={backendStatus !== 'synced'}
        />
      </TileGroup>
    </TileSection>
  )
}

export default More
