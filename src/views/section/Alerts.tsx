import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import HighlightIcon from '@mui/icons-material/Highlight'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'
import { BatteryTile } from '../../components/specialTiles/ZigbeeTiles'
import ToggleHelperTile, {
  ToggleHelperTileProps
} from '../../components/entityTiles/toggleHelper/ToggleHelperTile'

const alertToggleProps: Partial<ToggleHelperTileProps> = {
  stateNames: ['DISABLED', 'enabled'],
  offColor: 'text-red-500',
  onIcon: <ChatOutlinedIcon />,
  offIcon: <AnnouncementIcon />
}

const Alerts = () => (
  <TileSection>
    <TileGroup name="Notifications">
      <ToggleHelperTile
        title="Tablet lights"
        entityName="alertTabletLights"
        onIcon={<HighlightIcon />}
        offIcon={<HighlightIcon />}
      />
      <ToggleHelperTile
        title="Sound alerts"
        entityName="alertSounds"
        onIcon={<VolumeUpIcon />}
        offIcon={<VolumeUpIcon />}
      />
      <ToggleHelperTile
        title="DND at night"
        entityName="alertDNDatNight"
        onIcon={<NotificationsPausedIcon />}
        offIcon={<NotificationsPausedIcon />}
      />
    </TileGroup>
    <TileGroup name="System and devices">
      <BatteryTile />
      <ToggleHelperTile
        title="Battery level alerts"
        entityName="alertBatteryLevel"
        {...alertToggleProps}
      />
      <ToggleHelperTile
        title="Self-diagnostic alerts"
        entityName="alertSelfDiagnostic"
        {...alertToggleProps}
      />
    </TileGroup>
    <TileGroup name="Security">
      <ToggleHelperTile
        title="Door deadbolt sensor"
        entityName="mainDoorDeadboltSensor contact"
        onIcon={<LockIcon />}
        offIcon={<LockOpenIcon />}
        offColor="text-red-500"
        stateNames={['open', 'closed']}
        reverseState
        readonly
      />
      <ToggleHelperTile
        title="Door deadbolt alarm"
        entityName="alertDoorDeadbolt"
        {...alertToggleProps}
      />
    </TileGroup>
    <TileGroup name="Water leak monitoring">
      <PlaceholderTile title="Filter sensor" size="standard" />
      <PlaceholderTile title="Washing machine sensor" size="standard" />
      <PlaceholderTile title="Bathroom sensor" size="standard" />
      <ToggleHelperTile
        title="Water leak alerts"
        entityName="alertWaterLeak"
        {...alertToggleProps}
      />
    </TileGroup>
  </TileSection>
)

export default Alerts
