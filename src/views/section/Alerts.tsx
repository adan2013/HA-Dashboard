import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import HighlightIcon from '@mui/icons-material/Highlight'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import AnnouncementIcon from '@mui/icons-material/Announcement'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import TileSection from '../../components/layout/TileSection'
import TileGroup from '../../components/layout/TileGroup'
import PlaceholderTile from '../../PlaceholderTile'
import { BatteryTile } from '../../components/specialTiles/ZigbeeTiles'
import ToggleHelperTile, {
  ToggleHelperTileProps
} from '../../components/entityTiles/helpers/ToggleHelperTile'
import DateCountdownHelperTile from '../../components/entityTiles/helpers/DateCountdownHelperTile'

const alertToggleProps: Partial<ToggleHelperTileProps> = {
  stateNames: ['DISABLED', 'enabled'],
  offColor: 'text-red-500',
  onIcon: <ChatOutlinedIcon />,
  offIcon: <AnnouncementIcon />
}

const waterLeakSensorProps: Partial<ToggleHelperTileProps> = {
  stateNames: ['ready', 'ALARM'],
  onColor: 'text-red-600',
  onIcon: <WaterDropIcon />,
  offIcon: <WaterDropOutlinedIcon />,
  readonly: true,
  tileProps: {
    isTurnedOff: false
  },
  metadataRenderer: entityState => {
    if (!entityState || !entityState.attributes) return undefined
    const { battery, linkquality } = entityState.attributes
    return [`${battery || '--'}%`, `${linkquality || '--'} LQI`]
  }
}

const Alerts = () => (
  <TileSection>
    <TileGroup name="Notifications">
      <ToggleHelperTile
        title="Tablet lights"
        entityId="input_boolean.alerttabletlights"
        onIcon={<HighlightIcon />}
        offIcon={<HighlightIcon />}
      />
      <ToggleHelperTile
        title="Sound alerts"
        entityId="input_boolean.alertsounds"
        onIcon={<VolumeUpIcon />}
        offIcon={<VolumeUpIcon />}
      />
      <ToggleHelperTile
        title="DND at night"
        entityId="input_boolean.alertdndatnight"
        onIcon={<NotificationsPausedIcon />}
        offIcon={<NotificationsPausedIcon />}
        metadataRenderer={() => ['22-7']}
      />
      <PlaceholderTile title="SMS alerts" size="standard" />
    </TileGroup>
    <TileGroup name="System and devices">
      <BatteryTile />
      <ToggleHelperTile
        title="Battery level alerts"
        entityId="input_boolean.alertbatterylevel"
        {...alertToggleProps}
      />
      <ToggleHelperTile
        title="Self-diagnostic alerts"
        entityId="input_boolean.alertselfdiagnostic"
        {...alertToggleProps}
      />
    </TileGroup>
    <TileGroup name="Security">
      <ToggleHelperTile
        title="Door deadbolt sensor"
        entityId="binary_sensor.maindoordeadboltsensor_contact"
        onIcon={<LockIcon />}
        offIcon={<LockOpenIcon />}
        onColor="text-white"
        offColor="text-red-600"
        stateNames={['open', 'closed']}
        tileProps={{ isTurnedOff: false }}
        reverseState
        readonly
      />
      <ToggleHelperTile
        title="Door deadbolt alarm"
        entityId="input_boolean.alertdeadbolt"
        {...alertToggleProps}
      />
    </TileGroup>
    <TileGroup name="Water leak monitoring">
      <ToggleHelperTile
        title="Filter sensor"
        entityId="binary_sensor.waterfilterleaksensor_water_leak"
        {...waterLeakSensorProps}
      />
      <ToggleHelperTile
        title="WM sensor"
        entityId="binary_sensor.washingmachineleaksensor_water_leak"
        {...waterLeakSensorProps}
      />
      <PlaceholderTile title="Bathroom sensor" size="standard" />
      <ToggleHelperTile
        title="Water leak alerts"
        entityId="input_boolean.alertwaterleak"
        {...alertToggleProps}
      />
    </TileGroup>
    <TileGroup name="Deadlines">
      <DateCountdownHelperTile
        title="Water filter"
        entityId="input_datetime.kitchenfilterservice"
        interval={120}
        warningThreshold={14}
        criticalThreshold={7}
      />
      <DateCountdownHelperTile
        title="Water mineralization filter"
        entityId="input_datetime.kitchenfinalfilterservice"
        interval={365}
        warningThreshold={14}
        criticalThreshold={7}
      />
      <DateCountdownHelperTile
        title="Water membrane filter"
        entityId="input_datetime.kitchenmembranefilterservice"
        interval={485}
        warningThreshold={14}
        criticalThreshold={7}
      />
      <DateCountdownHelperTile
        title="Car insurance"
        entityId="input_datetime.carinsurance"
        interval={365}
        warningThreshold={30}
        criticalThreshold={14}
      />
      <DateCountdownHelperTile
        title="Car technical inspection"
        entityId="input_datetime.cartechnicalinspection"
        interval={365}
        warningThreshold={30}
        criticalThreshold={14}
      />
      <DateCountdownHelperTile
        title="Coffee machine cleaning"
        entityId="input_datetime.coffeemachinecleaning"
        interval={10}
        warningThreshold={3}
        criticalThreshold={1}
      />
    </TileGroup>
  </TileSection>
)

export default Alerts
