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
import { BatteryTile } from '../../components/specialTiles/BatteryTile'
import ToggleHelperTile, {
  ToggleHelperTileProps
} from '../../components/entityTiles/helpers/ToggleHelperTile'
import DateCountdownHelperTile from '../../components/entityTiles/helpers/DateCountdownHelperTile'
import WaterLeakSensorTile from '../../components/entityTiles/sensors/WaterLeakSensorTile'

const alertToggleProps: Partial<ToggleHelperTileProps> = {
  stateNames: ['DISABLED', 'enabled'],
  offColor: 'text-red-500',
  onIcon: <ChatOutlinedIcon />,
  offIcon: <AnnouncementIcon />
}

const Alerts = () => (
  <TileSection>
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
    <TileGroup name="Water leak monitoring">
      <WaterLeakSensorTile
        title="Filter sensor"
        entityId="binary_sensor.waterfilterleaksensor_water_leak"
        batteryEntityId="sensor.waterfilterleaksensor_battery"
      />
      <WaterLeakSensorTile
        title="WM sensor"
        entityId="binary_sensor.washingmachineleaksensor_water_leak"
        batteryEntityId="sensor.washingmachineleaksensor_battery"
      />
      <PlaceholderTile title="Bathroom sensor" size="standard" />
      <ToggleHelperTile
        title="Water leak alerts"
        entityId="input_boolean.alertwaterleak"
        {...alertToggleProps}
      />
    </TileGroup>
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
  </TileSection>
)

export default Alerts
